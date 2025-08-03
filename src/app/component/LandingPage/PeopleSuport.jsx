export default function PeopleSupport() {
  // Card data (icon src, link only)
  const cards = [
    {
      icon: "/image/people_gui1.png",
      link: "/citizen/citizen-manual",
    },
    {
      icon: "/image/people_gui2.png",
      link: "/citizen/documents",
    },
    {
      icon: "/image/people_gui3.png",
      link: "/e-service/survey",
    },
    {
      icon: "/image/people_gui4.png",
      link: "/citizen/elderly-allowance",
      link: "/citizen/elderly-allowance",
    },
    {
      icon: "/image/people_gui5.png",
      link: "/citizen/disabled-allowance",
    },
    {
      icon: "/image/people_gui6.png",
      link: "/citizen/work-manual",
    },
    {
      icon: "/image/people_gui7.png",
      link: "/citizen/qa",
    },
    {
      icon: "/image/people_gui8.png",
      link: "/citizen/qa",
    },
  ];

  // Separate card for "ช่องทางรับฟังความคิดเห็น" based on the second image's layout
  const feedbackCard = {
    icon: "/image/manual-1-2.png", // This seems to be the icon from the first image for this specific item
    label: "ช่องทางรับฟัง\nความคิดเห็น",
    link: "/feedback",
  };

  return (
    <section
      className="flex flex-col items-center justify-center py-8 px-2 sm:px-4 relative bg-cover bg-center"
      style={{
        backgroundImage: "url(/image/people_support_bg.png)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <img
        src="/image/people_support.png"
        alt="งานบริการประชาชน"
        className="w-[140px] sm:w-[180px] md:w-[200px] object-contain mb-4"
      />
      <div className="w-full max-w-5xl mx-auto grid grid-cols-3 lg:grid-cols-4 gap-x-2 sm:gap-x-8 gap-y-4 sm:gap-y-12 px-2 sm:px-8 justify-items-center">
        {cards.map((card, idx) => (
          <a
            key={idx}
            href={card.link}
            className="w-full min-w-[140px] max-w-[220px] h-[90px] xs:h-[100px] sm:h-[120px] aspect-[180/100] text-center group relative"
          >
            <img
              src={card.icon}
              alt="service icon"
              className="w-[90px] xs:w-[120px] sm:w-[160px] md:w-[200px] object-contain transition-transform duration-300 group-hover:scale-105 mx-auto"
            />
          </a>
        ))}
      </div>
    </section>
  );
}
