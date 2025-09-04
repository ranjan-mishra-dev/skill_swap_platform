import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-3xl bg-white shadow-lg rounded-2xl p-10 text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">About SkillSwap</h1>
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          SkillSwap is a platform that helps people connect, share, and grow their skills. 
          Whether you want to learn coding, design, photography, or communication skills – 
          you can find someone willing to share their expertise while you share yours.  
        </p>

        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          Our mission is to make learning accessible, fun, and community-driven. 
          Instead of traditional learning methods, we believe in exchanging knowledge 
          and creating real human connections.  
        </p>

        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          At SkillSwap, collaboration is at the heart of everything we do. 
          Together, we can create a sustainable learning culture where everyone has 
          something to teach and something to learn.  
        </p>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-blue-500">Our Vision</h2>
          <p className="text-gray-600 mt-3">
            To build a global network of learners and mentors where knowledge flows freely 
            and empowers individuals to achieve their dreams.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
