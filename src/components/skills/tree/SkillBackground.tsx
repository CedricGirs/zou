
const SkillBackground = () => {
  return (
    <>
      {/* Circular rings */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full border border-gray-700 opacity-40"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full border border-gray-700 opacity-40"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] rounded-full border border-gray-700 opacity-40"></div>
      
      {/* Star dots scattered across the background */}
      <div className="absolute top-[15%] left-[20%] w-1 h-1 bg-white rounded-full opacity-70"></div>
      <div className="absolute top-[25%] left-[40%] w-1.5 h-1.5 bg-white rounded-full opacity-80"></div>
      <div className="absolute top-[35%] left-[65%] w-1 h-1 bg-white rounded-full opacity-60"></div>
      <div className="absolute top-[55%] left-[85%] w-2 h-2 bg-white rounded-full opacity-50"></div>
      <div className="absolute top-[75%] left-[30%] w-1 h-1 bg-white rounded-full opacity-70"></div>
      <div className="absolute top-[85%] left-[70%] w-1.5 h-1.5 bg-white rounded-full opacity-60"></div>
      <div className="absolute top-[10%] left-[90%] w-1 h-1 bg-white rounded-full opacity-80"></div>
      <div className="absolute top-[60%] left-[10%] w-1.5 h-1.5 bg-white rounded-full opacity-70"></div>
      
      {/* Larger, glowing stars */}
      <div className="absolute top-[30%] left-[35%] w-2 h-2 bg-blue-200 rounded-full opacity-90 animate-pulse"></div>
      <div className="absolute top-[70%] left-[65%] w-2 h-2 bg-purple-200 rounded-full opacity-90 animate-pulse"></div>
      <div className="absolute top-[20%] left-[75%] w-2 h-2 bg-indigo-200 rounded-full opacity-90 animate-pulse"></div>
    </>
  );
};

export default SkillBackground;
