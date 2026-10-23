import { LiquidGlassWrapper } from "../LiquidGlassWrapper";
import { PlaylistSearch } from "../PlaylistSearch";
import { PlaylistSongs } from "../PlaylistSongs";

export function Playlist() {
  return (
    <section
      id="playlist"
      className="
        relative flex min-h-svh w-full snap-start flex-col
        items-center overflow-hidden
        bg-[url('/AYM_9074_1.jpeg')] bg-cover bg-no-repeat
        px-4 pt-28 pb-8
        sm:px-6 sm:pt-32 sm:pb-10
        lg:h-screen lg:min-h-0 lg:px-8 lg:pt-36 lg:pb-14
        bg-[25%_center]
      "
    >
      {/* CABEÇALHO */}
      <div className="relative z-10 flex w-full shrink-0 flex-col items-center text-center">
        <div className="border-b-2 border-primary px-2 pb-1">
          <h1 className="font-cormorant text-2xl font-bold uppercase text-primary-light sm:text-3xl">
            Playlist
          </h1>
        </div>

        <h5 className="mt-2 max-w-3xl font-lora text-xs uppercase leading-relaxed text-primary-light sm:text-sm">
          ESCOLHA E SUGIRA MÚSICAS PARA O NOSSO GRANDE DIA!
        </h5>
      </div>

      {/* CONTEÚDO */}
      <div
        className="
          relative z-10 mt-6 flex w-full flex-1 flex-col gap-4
          sm:mt-7 sm:gap-5
          lg:min-h-0 lg:flex-row-reverse
        "
      >
        {/* PAINEL DA PLAYLIST */}
        <div
          className="
            flex min-h-[32rem] w-full flex-col
            sm:min-h-[36rem]
            lg:h-full lg:min-h-0 lg:w-[50%]
          "
        >
          <LiquidGlassWrapper className="h-full min-h-0 flex-1 rounded-3xl bg-black/70 ">
            <div className="flex h-full min-h-0 flex-col items-center p-3 sm:p-4">
              {/* TÍTULO */}
              <div className="shrink-0 border-b-2 border-primary px-2 pb-1">
                <h1 className="font-cormorant text-base uppercase text-primary-light">
                  Selecione a Música
                </h1>
              </div>

              {/* BUSCA E RANKING */}
              <div className="mt-4 flex min-h-0 w-full flex-1 flex-col gap-4">
                <div className="w-full shrink-0">
                  <PlaylistSearch />
                </div>

                <LiquidGlassWrapper className="min-h-[18rem] flex-1 rounded-3xl sm:min-h-[20rem] lg:min-h-0">
                  <div className="flex h-full min-h-0 flex-col p-3 sm:p-4">
                    {/* TÍTULO DO RANKING */}
                    <div className="shrink-0 border-b-2 border-primary px-2 pb-1">
                      <h1 className="font-cormorant text-base uppercase text-primary-light">
                        Ranking
                      </h1>
                    </div>

                    {/* MÚSICAS */}
                    <div className="mt-4 min-h-0 flex-1">
                      <PlaylistSongs />
                    </div>
                  </div>
                </LiquidGlassWrapper>
              </div>
            </div>
          </LiquidGlassWrapper>
        </div>
      </div>
    </section>
  );
}
