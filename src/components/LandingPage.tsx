interface LandingPageProps {
  loginUrl: string
}

export default function LandingPage({ loginUrl }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="hh-card p-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="text-[#d6001c] font-bold text-3xl">hh</div>
            <div className="text-[#232529] font-medium text-2xl">агент</div>
          </div>
          
          <h1 className="text-2xl font-bold text-[#232529] mb-4">
            AI-помощник для поиска работы
          </h1>
          
          <p className="text-[#999999] mb-8">
            Автоматическая генерация откликов на вакансии с hh.ru
          </p>
          
          <a href={loginUrl} className="hh-btn hh-btn-primary w-full">
            Войти через hh.ru
          </a>
          
          <div className="mt-8 pt-8 border-t border-[#e7e7e7]">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-[#232529]">85%</div>
                <div className="text-xs text-[#999999]">выше отклик</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#232529]">10x</div>
                <div className="text-xs text-[#999999]">быстрее</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#232529]">AI</div>
                <div className="text-xs text-[#999999]">GPT-4</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}