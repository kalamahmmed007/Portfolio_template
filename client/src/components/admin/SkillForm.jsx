// src/components/admin/SkillForm.jsx
import React, { useState } from "react";

const SkillForm = () => {
  const [skill, setSkill] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    alert(`Added skill: ${skill}`);
    setSkill("");
  };

  return (
    <div className="max-w-md rounded bg-white p-6 shadow dark:bg-gray-800">
      <h2 className="mb-4 text-xl font-bold">Add New Skill</h2>
      <form onSubmit={handleAdd} className="space-y-4">
        <input
          type="text"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          placeholder="Skill name"
          className="w-full rounded border border-gray-300 p-2 dark:bg-gray-700 dark:text-white"
        />
        <button
          type="submit"
          className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        >
          Add Skill
        </button>
      </form>
    </div>
  );
};

export default SkillForm;
