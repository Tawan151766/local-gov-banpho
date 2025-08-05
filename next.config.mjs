/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
      return [
        {
          source: "/(.*)", // ทุกเส้นทาง
          headers: [
            {
              key: "Referrer-Policy",
              value: "no-referrer", // หรือใช้ "origin-when-cross-origin"
            },
          ],
        },
      ];
    },
  };
  
  export default nextConfig;
  