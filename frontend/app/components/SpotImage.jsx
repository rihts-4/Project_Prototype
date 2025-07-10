import { StyleSheet, Image } from "react-native";
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function SpotImage({ spotName, imageNumber }) {
    let image_1;
    let image_2;

    switch (spotName) {
        case "Tokyo Skytree":
            image_1 = require("../assets/tokyo_skytree_1.jpg");
            image_2 = require("../assets/tokyo_skytree_2.jpg");
            break;
        case "Osaka Castle":
            image_1 = require("../assets/OsakaCastle_image_1.jpg");
            image_2 = require("../assets/OsakaCastle_image_2.jpg");
            break;
        case "Okinawa Churaumi Aquarium":
            image_1 = require("../assets/ChuraumiAquarium_image_1.jpg");
            image_2 = require("../assets/ChuraumiAquarium_image_2.jpg");
            break;
        case "Ise Jingu":
            image_1 = require("../assets/IseJingu_image_1.jpg");
            image_2 = require("../assets/IseJingu_image_2.jpg");
            break;
        case "Fushimi Inari Taisha":
            image_1 = require("../assets/FushimiInariTaisha_image_1.jpg");
            image_2 = require("../assets/FushimiInariTaisha_image_2.jpg");
            break;
        case "Mt. Fuji":
            image_1 = require("../assets/Fuji_image_1.jpg");
            image_2 = require("../assets/Fuji_image_2.jpg");
            break;
        case "Kinkaku-ji (Golden Pavilion)":
            image_1 = require("../assets/Kinkakuji_image_1.jpg");
            image_2 = require("../assets/Kinkakuji_image_2.jpg");
            break;
        case "Ginkaku-ji (Silver Pavilion)":
            image_1 = require("../assets/Ginkakuji_image_1.jpg");
            image_2 = require("../assets/Ginkakuji_image_2.jpg");
            break;
        case "Kiyomizu Temple":
            image_1 = require("../assets/kiyomizudera_1.jpg");
            image_2 = require("../assets/kiyomizudera_2.jpg");
            break;
        case "Himeji Castle":
            image_1 = require("../assets/Himeji_Castle_image_1.jpg");
            image_2 = require("../assets/Himeji_Castle_image_2.jpg");
            break;
        case "Shirakawa-go":
            image_1 = require("../assets/Shirakawa-go_image_1.jpg");
            image_2 = require("../assets/Shirakawa-go_image_2.jpg");
            break;
        case "Tokyo Disneyland":
            image_1 = require("../assets/Tokyo_Disneyland_image_1.jpg");
            image_2 = require("../assets/Tokyo_Disneyland_image_2.jpg");
            break;
        case "Universal Studios Japan":
            image_1 = require("../assets/Universal_Studios_Japan_image_1.jpg");
            image_2 = require("../assets/Universal_Studios_Japan_image_2.jpg");
            break;
        case "Fuji-Q Highland":
            image_1 = require("../assets/hujiQhighland_1.jpg");
            image_2 = require("../assets/hujiQhighland_2.jpg");
            break;
        case "Huis Ten Bosch":
            image_1 = require("../assets/huis_ten_bosch_1.jpg");
            image_2 = require("../assets/huis_ten_bosch_2.jpg");
            break;
        case "Nagashima Spa Land":
            image_1 = require("../assets/nagashima_spaland_1.jpg");
            image_2 = require("../assets/nagashima_spaland_2.jpg");
            break;
        case "Yomiuriland":
            image_1 = require("../assets/yomiuriland_image_1.jpg");
            image_2 = require("../assets/yomiuriland_image_2.jpg");
            break;
        case "Tobu World Square":
            image_1 = require("../assets/tobu_world_square_1.jpg");
            image_2 = require("../assets/tobu_world_square_2.jpg");
            break;
        case "Enoshima Aquarium":
            image_1 = require("../assets/enoshima_aquarium_1.jpg");
            image_2 = require("../assets/enoshima_aquarium_2.jpg");
            break;
        case "Ishigaki Island":
            image_1 = require("../assets/ishigaki_island_1.jpg");
            image_2 = require("../assets/ishigaki_island_2.jpg");
            break;
        case "Enoshima":
            image_1 = require("../assets/enoshima_1.jpg");
            image_2 = require("../assets/enoshima_2.jpg");
            break;
        case "Tashirojima (Cat Island)":
            image_1 = require("../assets/Tashirojima_Cat_Island.jpg");
            image_2 = require("../assets/Tashirojima_Cat_Island_2.jpg");
            break;
        case "Awaji Island":
            image_1 = require("../assets/AwajiIsland_1.jpg"); //change
            image_2 = require("../assets/AwajiIsland_2.jpg"); //change
            break;
        case "Tokyo Tower":
            image_1 = require("../assets/TokyoTower_image_1.jpg");
            image_2 = require("../assets/TokyoTower_image_2.jpg");
            break;
        case "Shibuya Scramble Crossing":
            image_1 = require("../assets/ShibuyaScrambleCrossing_1.jpg");
            image_2 = require("../assets/ShibuyaScrambleCrossing_2.jpg");
            break;
        case "Odaiba":
            image_1 = require("../assets/Odaiba_1.jpg");
            image_2 = require("../assets/Odaiba_2.jpg");
            break;
        case "Dotonbori":
            image_1 = require("../assets/Dotonbori_1.jpg");
            image_2 = require("../assets/Dotonbori_2.jpg");
            break;
        case "Umeda Sky Building":
            image_1 = require("../assets/UmedaSkyBuilding_1.jpg");
            image_2 = require("../assets/UmedaSkyBuilding_2.jpg");
            break;
        case "Nagoya Castle":
            image_1 = require("../assets/NagoyaCastel_1.jpg");
            image_2 = require("../assets/NagoyaCastel_2.jpg");
            break;
        case "Nakasu":
            image_1 = require("../assets/Nakasu_1.jpg");
            image_2 = require("../assets/Nakasu_2.jpg");
            break;
        case "Sapporo Clock Tower":
            image_1 = require("../assets/SapporoClockTower_1.jpg");
            image_2 = require("../assets/SapporoClockTower_2.jpg");
            break;
        case "Arashiyama":
            image_1 = require("../assets/Arashiyama_1.jpg");
            image_2 = require("../assets/Arashiyama_2.jpg");
            break;
        case "Kamikochi":
            image_1 = require("../assets/Kamikochi_1.jpg");
            image_2 = require("../assets/Kamikochi_2.jpg");
            break;
        case "Tsukiji Outer Market":
            image_1 = require("../assets/TsukijiOuterMarket_1.jpg");
            image_2 = require("../assets/TsukijiOuterMarket_2.jpg");
            break;
        case "Nara Park":
            image_1 = require("../assets/NaraPark_1.jpg");
            image_2 = require("../assets/NaraPark_2.jpg");
            break;
        case "Mt Koya (Koyasan)":
            image_1 = require("../assets/MtKoya_1.jpg");
            image_2 = require("../assets/MtKoya_2.jpg");
            break;
        case "Ginzan Onsen":
            image_1 = require("../assets/GinzanOnsen_1.jpg");
            image_2 = require("../assets/GinzanOnsen_2.jpg");
            break;
        case "Nikko Toshogu Shrine":
            image_1 = require("../assets/NikkoToshogu_1.jpg");
            image_2 = require("../assets/NikkoToshogu_2.jpg");
            break;
        case "Itsukushima Shrine (Miyajima)":
            image_1 = require("../assets/ItsukushimaShrine_1.jpg");
            image_2 = require("../assets/ItsukushimaShrine_2.jpg");
            break;
        case "Harajuku & Omotesando":
            image_1 = require("../assets/HarajyukuOmotesando_1.jpg");
            image_2 = require("../assets/HarajyukuOmotesando_2.jpg");
            break;
        case "Nakano Broadway":
            image_1 = require("../assets/NakanoBroadway_1.jpg");
            image_2 = require("../assets/NakanoBroadway_2.jpg");
            break;
        case "Kobe Harborland":
            image_1 = require("../assets/KobeHarborland_1.jpg");
            image_2 = require("../assets/KobeHarborland_2.jpg");
            break;
        case "Minato Mirai":
            image_1 = require("../assets/Minatomirai_1.jpg");
            image_2 = require("../assets/Minatomirai_2.jpg");
            break;
        case "Roppongi Hills":
            image_1 = require("../assets/Roppongihiruzu_1.jpg");
            image_2 = require("../assets/Roppongihiruzu_2.jpg");
            break;
        case "Susukino":
            image_1 = require("../assets/Susukino_1.jpg");
            image_2 = require("../assets/Susukino_2.jpg");
            break;
        case "Hakodate Morning Market":
            image_1 = require("../assets/HakodateMorningMarket_1.jpg");
            image_2 = require("../assets/HakodateMorningMarket_2.jpg");
            break;
        case "Izumo Taisha":
            image_1 = require("../assets/Izumotaisha_1.jpg");
            image_2 = require("../assets/Izumotaisha_2.jpg");
            break;
        case "Yakushima":
            image_1 = require("../assets/Yakushima_1.jpg");
            image_2 = require("../assets/Yakushima_2.jpg");
            break;
        case "Asakusa":
            image_1 = require("../assets/Asakusa_1.jpg");
            image_2 = require("../assets/Asakusa_2.jpg");
            break;
        case "Oarai Isosaki Shrine (Kamiiso no Torii)":
            image_1 = require("../assets/OaraiIsosakiShrine_1.jpg");
            image_2 = require("../assets/OaraiIsosakiShrine_2.jpg");
            break;
        case "Meiji Jingu":
            image_1 = require("../assets/Meijijingu_1.jpg");
            image_2 = require("../assets/Meijijingu_2.jpg");
            break;
        case "Kaiyukan Aquarium":
            image_1 = require("../assets/Kaiyukan_1.jpg");
            image_2 = require("../assets/Kaiyukan_2.jpg");
            break;
        case "Gran Green Osaka":
            image_1 = require("../assets/GranGreenOsaka_1.jpg");
            image_2 = require("../assets/GranGreenOsaka_2.jpg");
            break;
        case "Tenjinbashisuji Shopping Street":
            image_1 = require("../assets/enjinbashisujiShoppingStreet_1.jpg");
            image_2 = require("../assets/enjinbashisujiShoppingStreet_2.jpg");
            break;
        case "Osaka Tenmangu Shrine":
            image_1 = require("../assets/OsakaTenmanguShrine_1.jpg");
            image_2 = require("../assets/OsakaTenmanguShrine_2.jpg");
            break;
        case "Kuromon Market":
            image_1 = require("../assets/KuronomonMarket_1.jpg");
            image_2 = require("../assets/KuronomonMarket_2.jpg");
            break;
        case "America village":
            image_1 = require("../assets/AmericaMura_1.jpg");
            image_2 = require("../assets/AmericaMura_2.jpg");
            break;
        case "Expo 2025 Osaka Kansai":
            image_1 = require("../assets/OsakaBanpaku2025_1.jpg");
            image_2 = require("../assets/OsakaBanpaku2025_2.jpg");
            break;
        case "Solaniwa Onsen Osaka Bay Tower":
            image_1 = require("../assets/SolaniwaOnsen_1.jpg");
            image_2 = require("../assets/SolaniwaOnsen_2.jpg");
            break;
        case "Abeno Harukas":
            image_1 = require("../assets/AbenoHarukasu_1.jpg");
            image_2 = require("../assets/AbenoHarukasu_2.jpg");
            break;
        case "Expo '70 Commemorative Park":
            image_1 = require("../assets/Banpaku_1.jpg");
            image_2 = require("../assets/Banpaku_2.jpg");
            break;
        case "Sumiyoshi Taisha Shrine":
            image_1 = require("../assets/SumiyoshiTaisha_1.jpg");
            image_2 = require("../assets/SumiyoshiTaisha_2.jpg");
            break;
        case "Osaka Korean Town":
            image_1 = require("../assets/KoreanTown_1.jpg");
            image_2 = require("../assets/KoreanTown_2.jpg");
            break;
        case "Tennoji Zoo":
            image_1 = require("../assets/TennojiZoo_1.jpg");
            image_2 = require("../assets/TennojiZoo_2.jpg");
            break;
        case "Spa World":
            image_1 = require("../assets/SpaWorld_1.jpg");
            image_2 = require("../assets/SpaWorld_2.jpg");
            break;
        case "Tsutenkaku Tower":
            image_1 = require("../assets/TutenkakuTower_1.jpg");
            image_2 = require("../assets/TutenkakuTower_2.jpg");
            break;
        default:
            image_1 = require("../assets/placeholder.png");
            image_2 = require("../assets/placeholder.png");
            break;
    }

    if (imageNumber === 1) {
        return (
            <Image
                source={image_1}
                style={styles.discoverImage}
            />
        );
    } else if (imageNumber === 2) {
        return (
            <Image
                source={image_2}
                style={styles.topImage}
            />
        );
    } else {
        return null; // Return null if imageNumber is not 1 or 2
    }
}

const styles = StyleSheet.create({
    discoverImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 5,
    resizeMode: 'cover',
  },
  topImage: {
    width: width,
    height: width * 0.6,
    resizeMode: 'cover',
    marginBottom: 15,
  },
})