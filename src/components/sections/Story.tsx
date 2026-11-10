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
              Nós nos conhecemos quando éramos adolescentes, e um de nós já tinha certeza do que queria desde aquela época.
              <br /><br />
              Cada um foi crescendo e amadurecendo, mas sempre nos encontrávamos em eventos de amigos em comum. A amizade um com o outro foi se fortalecendo, tanto que em 03/12/2023 aquela amizade se tornou um sentimento muito maior e começamos oficialmente a namorar!
              <br /><br />
              Desde então, estamos construindo uma história de alegria, aprendizado, cumplicidade e companheirismo. Nosso amor se tornou ainda maior que tivemos a certeza que queríamos muito mais que compartilhar momentos: compartilhar a vida. Foi então que em 03/04/2026 ficamos noivos!
              <br /><br />
              Agora, estamos nos preparando para viver um dos dias mais especiais das nossas vidas: nosso casamento. O dia que celebraremos nosso amor ao lado das pessoas que fazem parte da nossa história. Para isso, queremos muito ter você conosco!
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