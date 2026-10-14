// Pictograms whose people are redrawn with another skin tone, many with black hair,
// so the cards show a mix of people closer to a US or Canadian classroom than
// ARASAAC's light skin and brown hair on everyone. Gray-haired people keep their hair.
// About half the pictograms with people are listed, spread across the packs.
// Pictograms where a darker skin could read as a stereotype (thief, jail, beggar,
// servant, lazy, crazy, witch) are left as ARASAAC draws them.
//
// Used by scripts/download-pictograms.ts. After changing a pictogram's look here,
// delete its PNG in src/lib/pictograms/ and run: bun run pictograms

/** Light to dark. ARASAAC's renderer draws the first ones; the deeper tones are painted. */
export const SKIN_TONES = {
  // `api`: ARASAAC's name for the tone in its renderer's query string.
  light: { api: "white", hex: "#F5E5DE" },
  medium: { api: "mulatto", hex: "#E3AB72" },
  tan: { api: "aztec", hex: "#CF9D7C" },
  dark: { api: "black", hex: "#A65C17" },
  darker: { hex: "#844B23" },
  deep: { hex: "#673C1F" },
} as const;

export type SkinTone = keyof typeof SKIN_TONES;

export interface Look {
  /** Light (ARASAAC's own) when left out. */
  skin?: SkinTone;
  /** ARASAAC's name for the hair color; brown (ARASAAC's own) when left out. */
  hair?: "black";
}

export const LOOKS: Record<number, Look> = {
  31680: { skin: "medium", hair: "black" }, // read
  28439: { hair: "black" }, // run
  4733: { skin: "darker" }, // rich
  27509: { skin: "tan" }, // girl
  2669: { skin: "dark" }, // arm
  11246: { skin: "deep", hair: "black" }, // army
  9044: { skin: "medium" }, // air
  37363: { skin: "darker" }, // birthday
  3298: { skin: "tan" }, // finger
  2422: { skin: "dark", hair: "black" }, // sister
  34560: { skin: "deep" }, // person
  9188: { skin: "medium", hair: "black" }, // boxer
  2684: { skin: "darker" }, // face
  23404: { skin: "tan", hair: "black" }, // course
  8666: { skin: "dark" }, // leg
  10310: { skin: "deep" }, // file
  38796: { skin: "medium" }, // think
  10200: { skin: "darker", hair: "black" }, // thin
  4963: { skin: "tan" }, // thirsty
  8129: { skin: "dark" }, // thanks
  12293: { skin: "deep", hair: "black" }, // healthy
  8715: { skin: "medium", hair: "black" }, // truth
  8603: { skin: "darker", hair: "black" }, // blacksmith
  15549: { skin: "tan", hair: "black" }, // fourth
  2840: { skin: "dark" }, // skin
  16865: { skin: "deep" }, // fist
  7227: { skin: "medium" }, // harvest
  6652: { skin: "darker" }, // trade
  4600: { skin: "dark", hair: "black" }, // blind
  2748: { skin: "deep" }, // back
  2919: { skin: "medium" }, // cheek
  7788: { skin: "darker" }, // shepherd
  3411: { skin: "tan" }, // shoemaker
  38900: { skin: "dark" }, // share
  16823: { skin: "deep" }, // show
  37997: { skin: "medium" }, // fashion
  24863: { skin: "darker" }, // attention
  6485: { skin: "tan" }, // push
  34826: { skin: "dark" }, // wash
  32814: { skin: "deep" }, // finish
  7176: { skin: "darker", hair: "black" }, // child
  3369: { skin: "tan", hair: "black" }, // chip
  3008: { skin: "dark" }, // butcher
  10343: { skin: "deep", hair: "black" }, // grandchild
  36478: { skin: "medium" }, // watchman
  21401: { hair: "black" }, // adventure
  27006: { skin: "darker" }, // coach
  24208: { skin: "tan" }, // reach
  6947: { skin: "dark" }, // search
  3293: { skin: "deep" }, // touch
  8582: { skin: "medium" }, // joy
  2957: { hair: "black" }, // judge
  39052: { skin: "darker" }, // jump
  6539: { skin: "tan", hair: "black" }, // june
  6488: { skin: "dark", hair: "black" }, // january
  10157: { skin: "deep", hair: "black" }, // magic
  16041: { skin: "medium" }, // manager
  31186: { skin: "darker" }, // rejoice
  37362: { skin: "tan" }, // marriage
  7072: { skin: "dark" }, // age
  15986: { skin: "deep" }, // charge
  27126: { skin: "medium" }, // visit
  32816: { skin: "darker" }, // desire
  2887: { skin: "tan" }, // nose
  16703: { skin: "dark", hair: "black" }, // sneeze
  24760: { skin: "deep" }, // lose
  21587: { skin: "medium" }, // refuse
  8993: { skin: "tan" }, // guide
  37231: { skin: "dark" }, // goodness
  35567: { skin: "deep" }, // anger
  11625: { skin: "medium" }, // forgive
  28459: { skin: "darker", hair: "black" }, // bug
  8195: { skin: "tan" }, // beg
  5952: { skin: "dark", hair: "black" }, // dig
  5442: { skin: "deep", hair: "black" }, // faint
  23718: { skin: "medium" }, // grandfather
  39678: { skin: "darker" }, // comfort
  8717: { skin: "tan" }, // life
  16883: { skin: "dark" }, // stuff
  13354: { skin: "deep" }, // laugh
  6631: { skin: "medium" }, // vote
  3019: { skin: "darker", hair: "black" }, // driver
  19553: { skin: "tan" }, // review
  6458: { skin: "dark" }, // drive
  11536: { skin: "deep" }, // love
  24819: { skin: "medium" }, // move
  7032: { skin: "darker", hair: "black" }, // them
  2497: { skin: "tan", hair: "black" }, // father
  31148: { skin: "dark", hair: "black" }, // mother
  6058: { skin: "deep" }, // bathe
  2380: { skin: "medium" }, // writing
  31146: { hair: "black" }, // dad
  6473: { skin: "darker" }, // body
  8640: { skin: "tan", hair: "black" }, // bride
  38445: { skin: "dark" }, // crowd
  4585: { skin: "deep", hair: "black" }, // singer
  4962: { skin: "medium" }, // hungry
  25944: { skin: "darker" }, // bang
  30472: { skin: "tan" }, // sling
  7280: { skin: "dark" }, // bring
  6986: { skin: "deep" }, // hang
  17231: { skin: "tan" }, // wring
  4556: { skin: "medium" }, // save
  8727: { skin: "darker" }, // polish
};
