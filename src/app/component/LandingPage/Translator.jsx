'use client'
import { useEffect } from 'react'

export default function Translator() {
  useEffect(() => {
    if (window.google && window.google.translate) {
      initGoogleTranslate()
      return
    }

    window.googleTranslateElementInit = () => {
      initGoogleTranslate()
    }

    const script = document.createElement("script")
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    script.async = true
    document.body.appendChild(script)

    function initGoogleTranslate() {
      new window.google.translate.TranslateElement({
        pageLanguage: 'th',
        includedLanguages: 'th,en,zh-CN',
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
      }, 'google_translate_element')

      // ใช้ MutationObserver รอดูการสร้าง iframe
      const observer = new MutationObserver((mutations, obs) => {
        const iframe = document.querySelector('iframe.goog-te-menu-frame')
        if (iframe) {
          console.log('✅ เจอ iframe Google Translate')

          // ปรับ style iframe และ container
          iframe.style.width = '160px'
          iframe.style.height = '300px'

          const container = document.getElementById('google_translate_element')
          if(container) {
            container.style.fontSize = '14px'
            container.style.width = '160px'
            container.style.height = '40px'
          }

          // ปรับ dropdown menu ของ Google
          const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
          if(iframeDoc) {
            const menu = iframeDoc.querySelector('.goog-te-menu2')
            if(menu) {
              menu.style.maxWidth = '160px'
            }
          }

          obs.disconnect()
        }
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })
    }
  }, [])

  return (
    <div
      id="google_translate_element"
      className="w-40 h-10"
      style={{ visibility: "visible" }}
    />
  )
}
