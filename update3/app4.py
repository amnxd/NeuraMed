import sqlite3
import os
from flask import Flask, request, jsonify
from openai import OpenAI
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# --- Database Setup ---
DB_NAME = "neuramed.db"

def get_db_connection():
    """Establishes a connection to the SQLite database."""
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes the database and creates tables if they don't exist."""
    if os.path.exists(DB_NAME):
        return  # Database already exists

    print("Creating new database...")
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create Users Table
    cursor.execute('''
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
    )
    ''')
    
    # Create Research Table
    cursor.execute('''
    CREATE TABLE research (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        compensation TEXT NOT NULL
    )
    ''')
    
    # Insert Sample Research Data
    sample_research = [
        ("Study on Mindfulness and Anxiety", "A 4-week study observing the effects of a daily mindfulness app on anxiety levels. Participants must be 18-30.", "$50 Gift Card"),
        ("Cognitive-Behavioral Therapy (CBT) for Insomnia", "Seeking participants who experience difficulty sleeping. This study involves 6 weekly sessions of virtual CBT.", "$120"),
        ("Impact of Fidget Tools on Focus", "A short, 2-hour in-person study at our local lab to measure focus and productivity while using different fidget tools.", "$40")
    ]
    cursor.executemany("INSERT INTO research (title, description, compensation) VALUES (?, ?, ?)", sample_research)
    
    conn.commit()
    conn.close()
    print("Database initialized with tables and sample data.")

# --- API Key Setup ---
# --- IMPORTANT ---
# Put your OpenAI API Key here. 
# Keep this file PRIVATE and never share it.
client = OpenAI(api_key="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") 
# ---------------

# --- Authentication Routes ---

@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if user already exists
    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
    if cursor.fetchone():
        conn.close()
        return jsonify({"error": "Username already taken"}), 409
    
    # Create new user
    password_hash = generate_password_hash(password)
    cursor.execute("INSERT INTO users (username, password_hash) VALUES (?, ?)", (username, password_hash))
    conn.commit()
    conn.close()
    
    return jsonify({"success": "User created successfully"}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
    user = cursor.fetchone()
    
    if user and check_password_hash(user["password_hash"], password):
        conn.close()
        # In a real app, you'd return a session token (JWT) here
        return jsonify({"success": "Login successful", "username": user["username"]}), 200
    else:
        conn.close()
        return jsonify({"error": "Invalid username or password"}), 401

# --- Research Route ---

@app.route("/research", methods=["GET"])
def get_research():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM research")
    research_studies = cursor.fetchall()
    conn.close()
    
    # Convert list of Row objects to list of dicts
    studies_list = [dict(study) for study in research_studies]
    return jsonify(studies_list), 200

# --- Chatbot Route ---

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.json
        user_input = data.get("message")
        # Language code will now be like "en-US", "hi-IN", etc.
        language = data.get("language", "en-US") 

        if not user_input:
            return jsonify({"error": "No message provided"}), 400

        # Extract simple 2-letter code (e.g., "hi" from "hi-IN")
        simple_lang_code = language.split('-')[0]

        # --- Dynamic System Prompt ---
        base_prompt = "You are NeuraMate, a kind, empathetic, and supportive mental health assistant. Listen calmly and give gentle, comforting replies. ALWAYS format lists, steps, or advice as a step-by-step list. Each point MUST be on a new line and start with a bullet or number (e.g., * or 1.)."
        
        # UPDATED: Map 2-letter codes to full names
        lang_map = {
            "en": "English",
            "hi": "Hindi (हिन्दी)",
            "es": "Spanish (Español)",
            "fr": "French (Français)",
            "de": "German (Deutsch)",
            "zh": "Mandarin (中文)",
            "ja": "Japanese (日本語)",
            "ar": "Arabic (العربية)",
            "pt": "Portuguese (Português)",
            "bn": "Bengali (বাংলা)",
            "ru": "Russian (Русский)",
            "ur": "Urdu (اردو)",
            "ta": "Tamil (தமிழ்)",
            "te": "Telugu (తెలుగు)",
            "mr": "Marathi (मराठी)",
            "gu": "Gujarati (ગુજરાતી)",
            "kn": "Kannada (ಕನ್ನಡ)",
            "ml": "Malayalam (മലയാളം)",
            "pa": "Punjabi (ਪੰਜਾਬੀ)"
        }
        
        # Use the simple code to find the name, fallback to the full code
        lang_name = lang_map.get(simple_lang_code, language) 
        
        language_instruction = f" You MUST respond in the following language: {lang_name}."
        system_content = base_prompt + language_instruction
        # --- End Dynamic Prompt ---

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_content}, # Use the dynamic prompt
                {"role": "user", "content": user_input},
            ]
        )

        bot_reply = response.choices[0].message.content
        return jsonify({"reply": bot_reply})
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": "Failed to get response from AI"}), 500

# --- Main Execution ---
if __name__ == "__main__":
    init_db()  # Initialize the database on startup
    app.run(debug=True, port=5000)