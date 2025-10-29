import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="py-16 px-4 border-t border-border bg-card/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Фонд «Игра»</h3>
            <p className="text-muted-foreground mb-4">
              Благотворительная акция. Все собранные средства пойдут на помощь детям с двигательными нарушениями.
            </p>
            <Button 
              variant="outline"
              className="border-2 border-accent hover:bg-accent hover:text-accent-foreground"
            >
              Узнать больше о фонде
            </Button>
          </div>
          
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>ИНН:</strong> ХХХХХХХХХХ</p>
            <p><strong>ОГРН:</strong> ХХХХХХХХХХХХХХ</p>
            <p><strong>Адрес:</strong> г. Москва, ул. Примерная, д. 1</p>
            <p><strong>Email:</strong> info@fondgame.ru</p>
            <p><strong>Телефон:</strong> +7 (XXX) XXX-XX-XX</p>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2025 Фонд «Игра». Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};
