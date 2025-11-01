import React from "react";
import { Link } from "react-router-dom";
import WordPuzzle from "../../components/games/WordPuzzle";

export default function WordPuzzlePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Word Puzzle Game</h1>
        <Link to="/" className="text-blue-600 hover:underline">← Back to Home</Link>
      </div>
      <div className="max-w-5xl mx-auto px-4 pb-10">
        <WordPuzzle />
      </div>
    </div>
  );
}
