import React from "react";

export default function MapsSection() {
  return (
<div className="relative w-full h-full">
  {/* Background Video */}
  <video
    autoPlay
    loop
    muted
    playsInline
    className="w-full h-full object-cover"
  >
    <source src="/image/map_video.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>

  {/* Overlay Text */}
  <div className="absolute inset-0 flex  justify-center md:top-20 top-5">
    <h2 className="text-md md:text-2xl font-bold text-[#01385f] text-center drop-shadow-lg ">
      MAP บ้านโพธิ์
    </h2>
  </div>
</div>


  );
}
