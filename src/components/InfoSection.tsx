import { Button } from "@/components/ui/button";

export const InfoSection = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section id="info-section" className="py-24 px-4 bg-card/50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-border shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Почему это важно
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
            Дети с двигательными нарушениями живут в режиме ожидания — лечения, адаптации, помощи. 
            Мы хотим, чтобы их детство не проходило мимо. Каждый донат помогает оплатить активные 
            коляски, оборудование для реабилитации и поддержку семей.
          </p>

          <Button
            size="lg"
            onClick={scrollToTop}
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Вернуться к игре
          </Button>
        </div>
      </div>
    </section>
  );
};
