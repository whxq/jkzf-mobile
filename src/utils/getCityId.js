import Storage from "./storage";
import { getAreaInfo } from "@/api/area";
async function getCityId() {
  try {
    // 获取存储的城市信息
    const locationData = await Storage.get('location');
    if (!locationData) {
      throw new Error("No location data found.");
    }

    // 处理城市名称，去掉“市”字
    const processedCityName = locationData.label.replace("市", "");

    // 获取城市 ID
    const res = await getAreaInfo({ name: processedCityName });
    const cityId = res.data.body.value;

    return cityId; // 返回城市 ID
  } catch (error) {
    console.error("Error fetching city ID:", error);
    return null; // 如果出错，返回 null 或抛出自定义错误
  }
}
export default getCityId