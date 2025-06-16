// components/LandingPage.tsx
interface LandingPageProps {
  loginUrl: string
}

export default function LandingPage({ loginUrl }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="font-bold text-xl">HH AI Assistant</div>
          <div className="hidden sm:flex space-x-6">
            <a href="#hero" className="hover:text-blue-600 transition">Главная</a>
            <a href="#features" className="hover:text-blue-600 transition">Возможности</a>
            <a href="#demo" className="hover:text-blue-600 transition">Демо</a>
            <a href="#app" className="hover:text-blue-600 transition">Приложение</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
        <div className="text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-800">
            AI помощник для поиска работы
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Генерируем персонализированные отклики с помощью ИИ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#demo" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg hover:bg-blue-700 transition">
              Посмотреть демо
            </a>
            <a href="#features" className="inline-block bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg text-lg hover:bg-blue-50 transition">
              Возможности
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Как это работает</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Авторизация через HH</h3>
              <p className="text-gray-600">Войдите через ваш аккаунт HeadHunter</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Поиск вакансий</h3>
              <p className="text-gray-600">Используйте фильтры или вставьте ссылку</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI генерация откликов</h3>
              <p className="text-gray-600">Получите персонализированные отклики</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-20">
        <div className="text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Демо</h2>
          <div className="bg-gray-300 rounded-lg w-full aspect-video flex items-center justify-center">
            <p className="text-gray-600">Видео демонстрация</p>
          </div>
        </div>
      </section>

      {/* App Section */}
      <section id="app" className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Начните прямо сейчас</h2>
          <p className="text-xl text-gray-600 mb-8">Войдите через HeadHunter и начните поиск работы</p>
          <a href={loginUrl} className="inline-block bg-red-600 text-white px-8 py-4 rounded-lg text-lg hover:bg-red-700 transition">
            Войти через HeadHunter
          </a>
        </div>
      </section>
    </div>
  )
}