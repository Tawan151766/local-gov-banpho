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

       {/* Button Section */}
       <div className="absolute md:bottom-20 bottom-2 left-1/2 transform -translate-x-1/2 flex flex-row md:flex-row items-center justify-center gap-4 w-full max-w-3xl mx-auto">

        {[
          {
            label: "ปั๊มน้ำมัน",
            imgAlt: "ปั๊มน้ำมัน",
            url: "https://www.google.com/search?sca_esv=1263d0ef7397b8b5&rlz=1C1VDKB_enTH1149TH1149&tbm=lcl&sxsrf=AE3TifPtE3BYQwDMfHKu_5O5MBNVL0g62Q:1754240097856&q=%E0%B9%80%E0%B8%97%E0%B8%A8%E0%B8%9A%E0%B8%B2%E0%B8%A5%E0%B8%95%E0%B8%B3%E0%B8%9A%E0%B8%A5%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B9%82%E0%B8%9E%E0%B8%98%E0%B8%B4%E0%B9%8C+%E0%B8%95.%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B9%82%E0%B8%9E%E0%B8%98%E0%B8%B4%E0%B9%8C+%E0%B8%AD.%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B9%82%E0%B8%9E%E0%B8%98%E0%B8%B4%E0%B9%8C+%E0%B8%88.%E0%B8%89%E0%B8%B0%E0%B9%80%E0%B8%8A%E0%B8%B4%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%A3%E0%B8%B2+%E0%B8%9B%E0%B8%B1%E0%B9%89%E0%B8%A1%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%A1%E0%B8%B1%E0%B8%99&rflfq=1&num=10&sa=X&ved=2ahUKEwj5t4jPje-OAxUqslYBHRNnJSAQjGp6BAgfEAE&biw=1707&bih=735&dpr=1.13#rlfi=hd:;si:;mv:[[13.6522029,101.1384605],[13.5632583,100.9831217]];tbs:lrf:!1m4!1u3!2m2!3m1!1e1!2m1!1e3!3sIAE,lf:1,lf_ui:3",
          },
          {
            label: "ร้านอาหาร",
            imgAlt: "ร้านอาหาร",
            url: "https://www.google.com/search?q=%E0%B9%80%E0%B8%97%E0%B8%A8%E0%B8%9A%E0%B8%B2%E0%B8%A5%E0%B8%95%E0%B8%B3%E0%B8%9A%E0%B8%A5%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B9%82%E0%B8%9E%E0%B8%98%E0%B8%B4%E0%B9%8C+%E0%B8%95.%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B9%82%E0%B8%9E%E0%B8%98%E0%B8%B4%E0%B9%8C+%E0%B8%AD.%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B9%82%E0%B8%9E%E0%B8%98%E0%B8%B4%E0%B9%8C+%E0%B8%88.%E0%B8%89%E0%B8%B0%E0%B9%80%E0%B8%8A%E0%B8%B4%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%A3%E0%B8%B2+%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%AD%E0%B8%B2%E0%B8%AB%E0%B8%B2%E0%B8%A3&sca_esv=1263d0ef7397b8b5&rlz=1C1VDKB_enTH1149TH1149&biw=1707&bih=735&tbm=lcl&sxsrf=AE3TifPM__x6GP7HeNth1a5kcDKT2Ejl9A%3A1754240110593&ei=bpSPaP_8I5eP2roPi7LKgQw&ved=0ahUKEwj_65HVje-OAxWXh1YBHQuZMsAQ4dUDCAo&uact=5&oq=%E0%B9%80%E0%B8%97%E0%B8%A8%E0%B8%9A%E0%B8%B2%E0%B8%A5%E0%B8%95%E0%B8%B3%E0%B8%9A%E0%B8%A5%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B9%82%E0%B8%9E%E0%B8%98%E0%B8%B4%E0%B9%8C+%E0%B8%95.%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B9%82%E0%B8%9E%E0%B8%98%E0%B8%B4%E0%B9%8C+%E0%B8%AD.%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B9%82%E0%B8%9E%E0%B8%98%E0%B8%B4%E0%B9%8C+%E0%B8%88.%E0%B8%89%E0%B8%B0%E0%B9%80%E0%B8%8A%E0%B8%B4%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%A3%E0%B8%B2+%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%AD%E0%B8%B2%E0%B8%AB%E0%B8%B2%E0%B8%A3&gs_lp=Eg1nd3Mtd2l6LWxvY2FsIrgB4LmA4LiX4Lio4Lia4Liy4Lil4LiV4Liz4Lia4Lil4Lia4LmJ4Liy4LiZ4LmC4Lie4LiY4Li04LmMIOC4lS7guJrguYnguLLguJnguYLguJ7guJjguLTguYwg4LitLuC4muC5ieC4suC4meC5guC4nuC4mOC4tOC5jCDguIgu4LiJ4Liw4LmA4LiK4Li04LiH4LmA4LiX4Lij4LiyIOC4o-C5ieC4suC4meC4reC4suC4q-C4suC4o0jmMFD4BljALXACeACQAQCYAZ8BoAGIDaoBBDAuMTS4AQPIAQD4AQGYAgqgAuAHwgIFECEYkgPCAggQABiABBiiBMICBRAAGO8FmAMAiAYBkgcDMi44oAfCQrIHAzAuOLgH3QfCBwUwLjkuMcgHEg&sclient=gws-wiz-local#rlfi=hd:;si:;mv:[[13.657739,101.11667840000001],[13.567503400000001,100.96878869999999]];tbs:lrf:!1m4!1u3!2m2!3m1!1e1!1m4!1u2!2m2!2m1!1e1!2m1!1e2!2m1!1e3!3sIAE,lf:1,lf_ui:9",
          },
          {
            label: "สถานที่สำคัญในพื้นที่",
            imgAlt: "สถานที่สำคัญ",
            url: "https://www.google.com/search?q=%E0%B9%80%E0%B8%97%E0%B8%A8%E0%B8%9A%E0%B8%B2%E0%B8%A5%E0%B8%95%E0%B8%B3%E0%B8%9A%E0%B8%A5%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B9%82%E0%B8%9E%E0%B8%98%E0%B8%B4%E0%B9%8C+%E0%B8%95.%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B9%82%E0%B8%9E%E0%B8%98%E0%B8%B4%E0%B9%8C+%E0%B8%AD.%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B9%82%E0%B8%9E%E0%B8%98%E0%B8%B4%E0%B9%8C+%E0%B8%88.%E0%B8%89%E0%B8%B0%E0%B9%80%E0%B8%8A%E0%B8%B4%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%A3%E0%B8%B2&sca_esv=1263d0ef7397b8b5&rlz=1C1VDKB_enTH1149TH1149&biw=1707&bih=735&tbm=lcl&sxsrf=AE3TifN0v2f2DwIZbgwPv84mkZ1f93gqxw%3A1754240251202&ei=-5SPaPiIDIPiseMPtZ-KsAw&ved=0ahUKEwi48peYju-OAxUDcWwGHbWPAsYQ4dUDCAo&uact=5&oq=%E0%B9%80%E0%B8%97%E0%B8%A8%E0%B8%9A%E0%B8%B2%E0%B8%A5%E0%B8%95%E0%B8%B3%E0%B8%9A%E0%B8%A5%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B9%82%E0%B8%9E%E0%B8%98%E0%B8%B4%E0%B9%8C+%E0%B8%95.%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B9%82%E0%B8%9E%E0%B8%98%E0%B8%B4%E0%B9%8C+%E0%B8%AD.%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B9%82%E0%B8%9E%E0%B8%98%E0%B8%B4%E0%B9%8C+%E0%B8%88.%E0%B8%89%E0%B8%B0%E0%B9%80%E0%B8%8A%E0%B8%B4%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%A3%E0%B8%B2&gs_lp=Eg1nd3Mtd2l6LWxvY2FsIpwB4LmA4LiX4Lio4Lia4Liy4Lil4LiV4Liz4Lia4Lil4Lia4LmJ4Liy4LiZ4LmC4Lie4LiY4Li04LmMIOC4lS7guJrguYnguLLguJnguYLguJ7guJjguLTguYwg4LitLuC4muC5ieC4suC4meC5guC4nuC4mOC4tOC5jCDguIgu4LiJ4Liw4LmA4LiK4Li04LiH4LmA4LiX4Lij4LiyMggQABiABBiiBDIFEAAY7wUyCBAAGIAEGKIEMggQABiABBiiBDIIEAAYgAQYogRI-RVQjhJY6RNwAHgAkAEAmAGHAaAB0wOqAQMwLjS4AQPIAQD4AQGYAgOgAtMCwgIFECEYkgOYAwCIBgGSBwMwLjOgB64WsgcDMC4zuAfTAsIHAzAuM8gHBQ&sclient=gws-wiz-local#rlfi=hd:;si:;mv:[[13.6015292,101.0858862],[13.598897599999999,101.07851219999999]];tbs:lrf:!1m4!1u3!2m2!3m1!1e1!1m4!1u2!2m2!2m1!1e1!2m1!1e2!2m1!1e3!3sIAE,lf:1,lf_ui:2",
          },
        ].map((btn, index) => (
          <button
            onClick={() => window.open(btn.url, "_blank")}
            key={index}
            className="flex items-center justify-center gap-2 md:w-[244px] w-[125px] md:h-[71px] h-[40px] flex-shrink-0 rounded-[15px] bg-white shadow transition duration-200 hover:bg-blue-50 hover:shadow-lg hover:scale-[1.02] md:px-4 px-2 "
          >
            {/* กลุ่ม icon และข้อความ */}
            <div className="flex items-center gap-2">
              <img
                src="/image/location.png"
                alt={btn.imgAlt}
                className="w-6 h-6 object-contain"
              />
              <span className="text-[#01385f] font-semibold text-[12px] md:text-lg">
                {btn.label}
              </span>
            </div>
          </button>
        ))}
      </div>
</div>





  );
}
