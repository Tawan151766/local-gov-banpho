export default function PeopleSupport() {
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
    },
    {
      icon: "/image/people_gui5.png",
      link: "https://govwelfare.dep.go.th/",
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
        className="w-[240px] sm:w-[180px] md:w-[500px] object-contain mb-4"
      />
      <div className="w-full max-w-6xl mx-auto grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-1 xs:gap-y-8 sm:gap-x-130 sm:gap-y-16 px-4 sm:px-10 justify-items-center md:justify-items-end">
        {cards.map((card, idx) => (
          <a
            key={idx}
            href={card.link}
            className="w-full min-w-[350px]    max-w-[500px] h-[80px] xs:h-[220px] md:w-[620px]  md:h-[260px]  text-center group relative"
          >
            <img
              src={card.icon}
              alt="service icon"
              className="w-[200px]  md:w-[620px] h-[80px] md:h-[220px] object-cover transition-transform duration-300 group-hover:scale-105 mx-auto"
            />
          </a>
        ))}
      </div>
    </section>
  );
}