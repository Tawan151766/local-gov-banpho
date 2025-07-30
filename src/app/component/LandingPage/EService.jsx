import { EServiceTop, EServiceBottom } from "./EServiceSection";
import FinanceSection from "./FinanceSection";
import InsideBander from "./InsideBander";

export default function EService() {
  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#F7F6E7] to-[#CDEBC7] px-2 sm:px-4"
      style={{
        background: "linear-gradient(180deg, #F7F6E7 0%, #CDEBC7 100%)",
      }}
    >
      <div
        className="my-5 w-full max-w-[1275px] mx-auto px-2 sm:px-4 md:px-8   rounded-[32px] md:rounded-[58px] shadow-xl backdrop-blur-[40px] md:backdrop-blur-[100px]"
        style={{
          background: "rgba(255,255,255,0.39)",
          boxShadow: "0 0 20.5px 0 rgba(0,0,0,0.20)",
          borderRadius: "58px",
          backdropFilter: "blur(100px)",
        }}
      >
        <EServiceTop />
        <EServiceBottom />
      </div>
      <FinanceSection />
      <InsideBander />
    </div>
  );
}
