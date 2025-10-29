# Альтернативное решение: Vercel (бесплатно, без пароля)

## Шаг 1: Загрузите на Vercel

1. Зайдите на https://vercel.com
2. Зарегистрируйтесь через GitHub (или email)
3. После входа нажмите **"Add New..."** → **"Project"**
4. Выберите **"Upload"** или перетащите папку `dist` прямо в браузер
5. Дождитесь загрузки - вам дадут адрес вида `ваш-сайт.vercel.app`
6. **Скопируйте этот адрес**

## Шаг 2: Вставьте в Tilda

Используйте тот же код iframe, но с новым адресом Vercel:

```html
<div style="width: 100%; min-height: 100vh;">
  <iframe 
    src="ВАШ-АДРЕС.vercel.app" 
    width="100%" 
    height="100vh" 
    frameborder="0"
    scrolling="no"
    style="border: none; display: block;"
  ></iframe>
</div>
```

Vercel полностью бесплатный и не требует пароля для публичных сайтов!

