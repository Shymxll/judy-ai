import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative w-full text-secondary-background overflow-hidden">
      {/* Arka plan videosu */}
      <video
        autoPlay
        loop
        playsInline
        className="w-full h-auto object-cover z-0"
      >
        <source src="https://mxvzhvnqbicigkzptjso.supabase.co/storage/v1/object/public/docs//video.mp4" type="video/mp4" />
        Tarayıcınız video etiketini desteklemiyor.
      </video>

      {/* İçerik */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-start px-4 sm:px-8 md:px-16 py-10 bg-chart-2/40">
        {/* Başlık ve açıklama istersen buraya eklenebilir */}
      </div>

      {/* Start Now Butonu - Video üzerine sabitlenmiş */}
      <div className="absolute z-20">
        {/* Mobil için buton - Video alt ortasında */}
        <div className="sm:hidden absolute bottom-4 left-16 transform -translate-x-1/2">
          <Link href="/start-case">
            <Button className="bg-foreground text-background text-base px-8 py-3 shadow-lg rounded-md hover:bg-primary whitespace-nowrap">
              Start Now
            </Button>
          </Link>
        </div>

        {/* Desktop için buton - Video sol alt köşesinde */}
        <div className="hidden sm:block absolute bottom-16 left-15">
          <Link href="/start-case">
            <Button className="bg-foreground text-background text-xl px-32 py-12 shadow-lg rounded-md hover:bg-primary whitespace-nowrap">
              Start Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}