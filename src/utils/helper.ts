/**
 * 高斯模糊
 * @param radius 模糊半径
 * @param imgData 图像数据
 * @returns {ImageData} 模糊后的图像数据
 */
export const gaussianBlur = (
  imgData: ImageData,
  radius: number = 2
): ImageData => {
  let pixes = new Uint8ClampedArray(imgData.data)
  const width = imgData.width
  const height = imgData.height
  let gaussMatrix = [],
    gaussSum: number,
    x,
    y,
    r,
    g,
    b,
    a,
    i,
    j,
    k,
    w

  // 模糊半径
  radius = Math.floor(radius * 3)
  // 正态分布的标准偏差 σ
  const sigma = radius / 3

  a = 1 / (Math.sqrt(2 * Math.PI) * sigma)
  b = -1 / (2 * sigma * sigma)

  //生成高斯矩阵
  for (i = -radius; i <= radius; i++) {
    gaussMatrix.push(a * Math.exp(b * i * i))
  }

  // x 方向一维高斯运算
  for (y = 0; y < height; y++) {
    for (x = 0; x < width; x++) {
      r = g = b = a = gaussSum = 0
      for (j = -radius; j <= radius; j++) {
        k = x + j
        if (k >= 0 && k < width) {
          i = (y * width + k) * 4
          w = gaussMatrix[j + radius]

          r += pixes[i] * w
          g += pixes[i + 1] * w
          b += pixes[i + 2] * w
          a += pixes[i + 3] * w

          gaussSum += w
        }
      }

      i = (y * width + x) * 4
      //计算加权均值
      imgData.data.set(
        [r, g, b, a].map((v) => v / gaussSum),
        i
      )
    }
  }

  pixes.set(imgData.data)

  // y 方向一维高斯运算
  for (x = 0; x < width; x++) {
    for (y = 0; y < height; y++) {
      r = g = b = a = gaussSum = 0
      for (j = -radius; j <= radius; j++) {
        k = y + j

        if (k >= 0 && k < height) {
          i = (k * width + x) * 4
          w = gaussMatrix[j + radius]

          r += pixes[i] * w
          g += pixes[i + 1] * w
          b += pixes[i + 2] * w
          a += pixes[i + 3] * w

          gaussSum += w
        }
      }
      i = (y * width + x) * 4
      imgData.data.set(
        [r, g, b, a].map((v) => v / gaussSum),
        i
      )
    }
  }

  return imgData
}

/**
 * 根据行列获取RGBA
 * @param imgData 图像数据
 * @param x 行
 * @param y 列
 * @returns {RGBA} RGBA
 */
const getRGBA = (imgData: ImageData, x: number, y: number): RGBA => {
  const width = imgData.width
  const pixes = imgData.data
  const index = y * width * 4 + x * 4
  return [pixes[index], pixes[index + 1], pixes[index + 2], pixes[index + 3]]
}

/**
 * 根据文字大小拆分图像
 * @param imgData 图像数据
 * @param fontSize 文字大小
 * @returns {Area[][]} 采样后的图像数据
 */
const sampl = (imgData: ImageData, fontSize: number): Area[][] => {
  const width = imgData.width
  const height = imgData.height
  const colunms = Math.floor(width / fontSize)
  const rows = Math.floor(height / fontSize)

  const samplData: Area[][] = []

  for (let i = 0; i < rows; i++) {
    const sampleRow: Area[] = []
    for (let j = 0; j < colunms; j++) {
      const x = j * fontSize
      const y = i * fontSize
      const area: Area = []
      for (let k = 0; k < fontSize; k++) {
        const row: RGBA[] = []
        for (let l = 0; l < fontSize; l++) {
          const rgba = getRGBA(imgData, x + k, y + l)
          row.push(rgba)
        }
        area.push(row)
      }
      sampleRow.push(area)
    }
    samplData.push(sampleRow)
  }

  return samplData
}

// 计算区域的平均色
const getAverage = (area: Area): RGBA => {
  let r = 0
  let g = 0
  let b = 0
  let a = 0
  let count = 0
  area.forEach((row) => {
    row.forEach((rgba) => {
      r += rgba[0]
      g += rgba[1]
      b += rgba[2]
      a += rgba[3]
      count++
    })
  })
  return [r / count, g / count, b / count, a / count]
}

// 计算每个文字的颜色
const textColors = (samplData: Area[][]): string[][] => {
  const colors: string[][] = []
  samplData.forEach((row) => {
    const colorRow: string[] = []
    row.forEach((area) => {
      const average = getAverage(area)
      colorRow.push(`rgba(${average.join(',')})`)
    })
    colors.push(colorRow)
  })
  return colors
}

export const getTextColor = (
  data: ImageData,
  fontSize: number = 12
): string[][] => {
  const samplData = sampl(data, fontSize)
  return textColors(samplData)
}

/** 一个像素点的rgba */
type RGBA = [number, number, number, number]
/** 一个文字大小区域的像素 */
type Area = RGBA[][]

export default {
  gaussianBlur,
  getTextColor,
}
