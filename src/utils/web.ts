function extractUrlParams(url: string) {
  const list = (url.split("?")[1] || "").split("&") || [];

  if (!list.length) return {};

  if (list.length === 1 && list[0] === "") return {};

  return list.reduce((acc: any, param) => {
    const [key, value] = param.split("=");

    acc[key] = {
      value: value,
    };

    if (value.includes("-")) {
      acc[key].ascending = value.split("-")[1] === "asc";
    }

    return acc;
  }, {});
}

export { extractUrlParams };
