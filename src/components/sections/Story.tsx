import { LiquidGlassWrapper } from "../LiquidGlassWrapper";

export function Story() {
  return (
    <section
      id="story"
      className="
        relative flex
        min-h-svh w-full
        snap-start snap-always
        bg-[url('/AYM_8714-5.jpeg')]
        bg-cover sm:bg-bottom bg-no-repeat
        overflow-hidden
        bg-[30%_center]
      "
    >
      {/* Gradiente para garantir a legibilidade do conteúdo */}
      {/* <div
        className="
          absolute inset-0 z-0
          bg-linear-to-l
          from-black/70
          via-black/15 via-40%
          to-black/0 to-85%
        "
      /> */}

      <div
        className="
          relative z-10
          flex w-full flex-col items-center
          px-4 pt-32 pb-8
          sm:px-6 sm:pt-36
          md:px-8 md:pt-36
        "
      >
        {/* Título */}
        <div className="border-b-2 border-primary px-2 pb-1">
          <h1
            className="
              font-cormorant font-bold uppercase
              text-2xl text-primary-dark
              sm:text-3xl
            "
          >
            Nossa História
          </h1>
        </div>

        {/* Conteúdo */}
        <div
          className="
            flex w-full grow flex-col
            items-end justify-end
            pt-8
          "
        >
          <LiquidGlassWrapper
            className="
              w-full max-w-xl
              rounded-3xl sm:rounded-4xl
              p-5 sm:p-6 md:p-8
              bg-black/70
            "
          >
            <p
              className="
                font-lora font-thin
                text-primary-light
                text-xs leading-relaxed
                sm:text-sm sm:leading-snug
                2xl:text-lg
              "
            >
              Nos conhecemos quando adolescentes, mas um de nós já tinha bem claro o que queria para a vida!
              <br />
              <br />
              Os dois sempre tiveram presentes na vida um do outro indiretamente... 
              nos víamos em alguns eventos de amigos em comum.
              <br />
              <br />
              Até que em 2023 começamos a passar mais tempo juntos e a nos conhecer melhor. 
              O sentimento foi crescendo e foi em 03.12.2023 que começamos a nossa história juntos. 
              E o Henrique ouviu o primeiro “sim” que ele queria ouvir.
              <br />
              <br />
              Passamos por muitos momentos felizes, de aprendizado e de muito companheirismo um com o outro nesse período. 
              A admiração, o carinho, o respeito e principalmente o nosso amor foi aumentando tanto, que estávamos certos de que queríamos dividir nossa vida um com o outro!
              <br/>
              <br/>
              Então, no dia 03.04.2026, o Henrique recebeu o ’Sim’, que ele mais queria ouvir naquele momento! 
              Foi o dia mais feliz na vida da Mariana até hoje.
              Oficialmente noivos!
              <br/>
              <br/>
              Agora estamos nos preparando para um dos dias mais especiais de nossas vidas, e gostaríamos muito de dividir isso com você!
            </p>
          </LiquidGlassWrapper>

          {/* Assinatura */}
          <div className="mt-6 text-center sm:mt-8">
            <p
              className="
                font-cormorant
                text-sm text-primary-light
                sm:text-base
              "
            >
              Com muito amor,
            </p>

            <h3
              className="
                font-bickham-script-pro-regular
                text-4xl font-bold
                text-primary-light
                sm:text-5xl
                md:text-6xl
              "
            >
              Mariana e Henrique
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}