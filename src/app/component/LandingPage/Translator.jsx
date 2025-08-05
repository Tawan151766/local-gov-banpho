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

      // Polling ตรวจสอบ iframe ทุก 500ms ไม่เกิน 10 วินาที
      let attempts = 0
      const maxAttempts = 20
      const interval = setInterval(() => {
        const iframe = document.querySelector('iframe.goog-te-menu-frame')
        if (iframe) {
          console.log('✅ เจอ iframe Google Translate')
          clearInterval(interval)
        } else {
          attempts++
          console.log(`❌ ไม่พบ iframe ของ Google Translate (พยายามครั้งที่ ${attempts})`)
          if (attempts >= maxAttempts) {
            clearInterval(interval)
            console.error('❌ ไม่สามารถโหลด iframe Google Translate ได้')
          }
        }
      }, 500)
    }
    function changeGoogleTranslateLanguage(langCode) {
        const iframe = document.querySelector('iframe.goog-te-menu-frame');
        if (!iframe) {
          console.warn('Google Translate iframe not found');
          return;
        }
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const langAnchor = iframeDoc.querySelector(`a[href*='?lang=${langCode}']`);
        if (langAnchor) {
          langAnchor.click();
        } else {
          console.warn(`Language link for ${langCode} not found`);
        }
      }
      
  }, [])

  return (
    <div
      id="google_translate_element"
      style={{ visibility: "visible", height: "auto" }}
    />
  )
}
