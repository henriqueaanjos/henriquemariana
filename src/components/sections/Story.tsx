import { LiquidGlassWrapper } from "../LiquidGlassWrapper";

export function Story() {
  return (
    <section
      id="story"
      className="
        relative flex
        min-h-svh w-full
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
              Nossa história começou ainda na adolescência, quando nos conhecemos, e por alguns anos nossos caminhos continuaram se cruzando em encontros e eventos de amigos em comum. Nossa amizade foi crescendo em 2023, quando decidimos nos conhecer melhor.
              <br /><br />
              Essa proximidade, e a admiração mútua, nos deu a certeza de um sentimento que haviamos desenvolvido, o amor um pelo outro, e no dia 03 de dezembro de 2023, decidimos abrir espaço para esse sentimento florecer, e começamos a namorar.
              <br /><br />
              Desde então, constuímos uma história repleta de alegrias, aprendizados, cumplicidade e companheirismo. A cada dia, nossa admiração, nosso respeito, e nosso amor se tornaram ainda maiores, trazendo a certeza de que queríamos muito mais do que compartilhar momentos: queríamos compartilhar a vida.
              <br /><br />
              E foi assim que, no dia 03 de abril de 2026, chegou o momento de dar mais um passo nessa história. Henrique ouviu o tão sonhado “sim” mais uma vez — dessa vez, o que selou a promessa de um futuro juntos. Para Mariana, foi o dia mais feliz de sua vida até então.
              Oficialmente, noivos! 💍
              <br /><br />
              Agora, estamos nos preparando para viver um dos dias mais especiais das nossas vidas: o dia em que celebraremos nosso amor ao lado das pessoas que fazem parte da nossa história.
              E, para tornar esse momento ainda mais inesquecível, queremos muito ter você conosco!

            </p>

            {/* Assinatura */}
            <div className="mt-6 text-end sm:mt-8">
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
          </LiquidGlassWrapper>
        </div>
      </div>
    </section>
  );
}