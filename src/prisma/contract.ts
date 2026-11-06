
import {
    defineContract,
    enumType,
    member,
} from "@prisma/orm-postgres/contract-builder";

export const RSVPStatus = enumType(
    "RSVPStatus",
    {
        codecId: "pg/text@1",
        nativeType: "text",
    } as const,
    member("PENDING", "PENDING"),
    member("CONFIRMED", "CONFIRMED"),
    member("DECLINED", "DECLINED"),
);

export const contract = defineContract({}, ({ field, model, rel }) => {
    const Photo = model("Photo", {
        fields: {
            id: field.id.uuidv7String(),

            userName: field.text(),
            name: field.text(),
            url: field.text(),
            storageKey: field.text().optional(),

            createdAt: field.temporal.createdAtString(),
            updatedAt: field.temporal.updatedAtString(),
        },
    });

    const Message = model("Message", {
        fields: {
            id: field.id.uuidv7String(),

            name: field.text(),
            message: field.text(),

            createdAt: field.temporal.createdAtString(),
            updatedAt: field.temporal.updatedAtString(),
        },
    });

    const Songs = model("Songs", {
        fields: {
            id: field.id.uuidv7String(),

            trackId: field.text().unique(),
            title: field.text(),
            artist: field.text(),
            album: field.text().optional(),
            artworkUrl: field.text().optional(),
            previewUrl: field.text().optional(),
            itunesUrl: field.text().optional(),

            likes: field.int().default(0),

            createdAt: field.temporal.createdAtString(),
            updatedAt: field.temporal.updatedAtString(),
        },
    });

    const Family = model("Family", {
        fields: {
            id: field.id.uuidv7String(),

            code: field.text().unique(),
            name: field.text(),

            createdAt: field.temporal.createdAtString(),
            updatedAt: field.temporal.updatedAtString(),
        },
    });

    const FamilyMember = model("FamilyMember", {
        fields: {
            id: field.id.uuidv7String(),

            familyId: field.uuidString(),
            name: field.text(),

            phone: field.text().optional(),

            status: field.namedType(RSVPStatus).default(
                RSVPStatus.members.PENDING,
            ),
            checkedInAt: field.temporal.createdAtString().optional(),

            createdAt: field.temporal.createdAtString(),
            updatedAt: field.temporal.updatedAtString(),
        },
    });

    return {
        enums: {
            RSVPStatus,
        },

        models: {
            Photo: Photo.relations({}),

            Message: Message.relations({}),

            Songs: Songs.relations({}),

            Family: Family.relations({
                members: rel.hasMany(FamilyMember, {
                    by: "familyId",
                }),
            }),

            FamilyMember: FamilyMember.relations({
                family: rel.belongsTo(Family, {
                    from: "familyId",
                    to: "id",
                }).sql({
                    fk: {
                        name: "FamilyMember_familyId_fkey",
                        onDelete: "cascade",
                    },
                }),
            }),
        },
    };
});