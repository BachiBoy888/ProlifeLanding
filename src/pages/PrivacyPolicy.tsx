import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="relative bg-[#0B0C10] min-h-screen">
      <div className="grain-overlay" />
      <div className="px-6 lg:px-[7vw] py-12 lg:py-16">
        <div className="max-w-3xl mx-auto">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#A9B1BA] hover:text-[#F4F6F8] transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться на сайт
          </a>

          <h1 className="font-display text-3xl lg:text-4xl font-bold text-[#F4F6F8] mb-2">
            Политика конфиденциальности
          </h1>
          <p className="text-sm text-[#A9B1BA] mb-10">
            Последнее обновление: март 2025 г.
          </p>

          <div className="space-y-8 text-[#A9B1BA] leading-relaxed">

            <section>
              <h2 className="font-display text-lg font-semibold text-[#F4F6F8] mb-3">
                1. Какие данные мы собираем
              </h2>
              <p className="mb-2">При отправке заявки или заполнении формы мы можем получать:</p>
              <ul className="pl-5 list-disc space-y-1">
                <li>Имя и фамилию (если указаны)</li>
                <li>Номер телефона</li>
                <li>Адрес электронной почты (если указан)</li>
                <li>Название компании (если указано)</li>
                <li>Параметры груза: вес, объём, город отправки</li>
                <li>Технические данные: IP-адрес, тип устройства и браузера, файлы cookie</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold text-[#F4F6F8] mb-3">
                2. Зачем мы собираем данные
              </h2>
              <ul className="pl-5 list-disc space-y-1">
                <li>Для обработки заявок на доставку и расчёта стоимости</li>
                <li>Для связи с клиентом по его запросу</li>
                <li>Для улучшения работы сайта и качества сервиса</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold text-[#F4F6F8] mb-3">
                3. Кому могут передаваться данные
              </h2>
              <p className="mb-2">
                Ваши данные не продаются и не передаются сторонним организациям в коммерческих целях.
                Они могут быть переданы:
              </p>
              <ul className="pl-5 list-disc space-y-1">
                <li>Сотрудникам Prolife Logistics для обработки вашей заявки</li>
                <li>Партнёрам по доставке — только в объёме, необходимом для выполнения заказа</li>
                <li>Государственным органам — исключительно по законному требованию</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold text-[#F4F6F8] mb-3">
                4. Как хранятся данные
              </h2>
              <p>
                Данные хранятся на защищённых серверах с ограниченным доступом.
                Мы применяем технические и организационные меры защиты от несанкционированного
                доступа, изменения или раскрытия. Срок хранения — не более 3 лет с момента
                последнего обращения, если иное не предусмотрено законодательством.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold text-[#F4F6F8] mb-3">
                5. Файлы cookie
              </h2>
              <p>
                Сайт использует файлы cookie для корректной работы. Cookie — небольшие текстовые
                файлы, сохраняемые на вашем устройстве браузером. Они не содержат личных данных и
                используются для функциональных нужд сайта. Вы можете отклонить использование cookie
                при первом посещении или отключить их в настройках браузера.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold text-[#F4F6F8] mb-3">
                6. Ваши права
              </h2>
              <p className="mb-2">Вы вправе:</p>
              <ul className="pl-5 list-disc space-y-1">
                <li>Запросить доступ к своим данным</li>
                <li>Потребовать исправления неточностей</li>
                <li>Потребовать удаления данных</li>
                <li>Отозвать согласие на обработку</li>
              </ul>
              <p className="mt-3">
                Для этого напишите нам на{' '}
                <a
                  href="mailto:office@prolife.kg"
                  className="text-[#4A90A4] hover:text-[#F4F6F8] transition-colors"
                >
                  office@prolife.kg
                </a>{' '}
                или позвоните:{' '}
                <a
                  href="tel:+996990111125"
                  className="text-[#4A90A4] hover:text-[#F4F6F8] transition-colors"
                >
                  +996 990 11 11 25
                </a>
                . Мы ответим в течение 5 рабочих дней.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold text-[#F4F6F8] mb-3">
                7. Контакты
              </h2>
              <address className="not-italic">
                <p className="text-[#F4F6F8] font-medium mb-1">Prolife Logistics</p>
                <p>Бишкек, Льва Толстого 36к/1, Бизнес центр Monolit</p>
                <p className="mt-1">
                  Email:{' '}
                  <a href="mailto:office@prolife.kg" className="text-[#4A90A4] hover:text-[#F4F6F8] transition-colors">
                    office@prolife.kg
                  </a>
                </p>
                <p>
                  Тел:{' '}
                  <a href="tel:+996990111125" className="text-[#4A90A4] hover:text-[#F4F6F8] transition-colors">
                    +996 990 11 11 25
                  </a>
                </p>
              </address>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
