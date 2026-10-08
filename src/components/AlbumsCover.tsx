import { CameraSlashIcon } from "@phosphor-icons/react";
import { Loading } from "./Loading";

type AlbumCoverProps = {
    title: string;
    photos: string[];
    emphasis?: boolean;
    isLoading?: boolean;
}

export function AlbumsCover({ title, photos, emphasis = false, isLoading = false }: AlbumCoverProps) {
    return (
        <div className="relative mx-auto aspect-4/3 w-[90%] group hover:scale-105 transition-all duration-300">
            {/* Foto de trás */}
            {photos.length > 2 && photos[2] && (
                <div
                    className="
                        absolute
                        inset-x-4
                        top-2
                        h-full
                        overflow-hidden
                        rounded-2xl
                        bg-white
                        shadow-lg
                        group-hover:rotate-12
                        rotate-6
                        transition-all
                        duration-500
                        group-hover:translate-x-2
                    "
                >
                    <img
                        src={photos[2]}
                        alt=""
                        className="h-full w-full object-cover"
                    />
                </div>
            )}

            {/* Foto do meio */}
            {photos.length > 1 && photos[1] && (
                <div
                    className="
                        absolute
                        inset-x-2
                        top-1
                        h-full
                        overflow-hidden
                        rounded-2xl
                        bg-white
                        shadow-lg
                        -rotate-3
                        transition-all
                        duration-500
                        group-hover:-translate-x-1
                        group-hover:-rotate-6
                    "
                >
                    <img
                        src={photos[1]}
                        alt=""
                        className="h-full w-full object-cover"
                    />
                </div>
            )}

            {/* Foto principal */}
            <div
                className={`
                    absolute
                    inset-0
                    overflow-hidden
                    rounded-2xl
                    bg-primary-light
                    shadow-xl
                    transition-transform
                    duration-500
                    group-hover:-translate-y-1
                    group-hover:rotate-2
                    group-hover:scale-105
                    ${emphasis ? "border-2 border-primary shadow-primary" : ""}
                `}
            >
                {photos.length > 0 ?
                    <img
                        src={photos[0]}
                        alt={title}
                        className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-700
                        group-hover:scale-105
                    "
                    />
                    :
                    isLoading ? (
                        <Loading />
                    ) : (
                        <CameraSlashIcon size={48} className="absolute top-1/2 left-1/2 -translate-1/2 opacity-40 text-primary-dark"/>
                    )
                }

                {/* Gradiente */}
                <div
                    className="
                        absolute
                        inset-0
                        bg-linear-to-t
                        from-black/70
                        via-black/10
                        to-transparent
                        group-hover:from-black/90
                        group-hover:via-black/40
                        transition-all
                        duration-300
                    "
                />

                {/* Informações */}
                <div
                    className="
                        absolute
                        bottom-0
                        left-0
                        p-5
                        text-white
                    "
                >
                    <h2 className="text-xl font-bold capitalize font-lora text-primary-light">
                        {title}
                    </h2>
                </div>
            </div>
        </div>
    )
}