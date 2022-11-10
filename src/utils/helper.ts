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
 * 计算文字的颜色
 * @param data 图像数据
 * @param fontSize 字体大小
 * @returns
 */
export const getTextColor = (
  data: ImageData,
  fontSize: number = 12
): string[][] => {
  const width = data.width
  const height = data.height
  const colunms = Math.floor(width / fontSize)
  const rows = Math.floor(height / fontSize)

  const getRGBA = (imgData: ImageData, x: number, y: number): RGBA => {
    const width = imgData.width
    const pixes = imgData.data
    const index = y * width * 4 + x * 4
    return [pixes[index], pixes[index + 1], pixes[index + 2], pixes[index + 3]]
  }

  const colors: string[][] = []

  for (let i = 0; i < rows; i++) {
    const colorRow: string[] = []
    for (let j = 0; j < colunms; j++) {
      const x = j * fontSize
      const y = i * fontSize
      let r = 0
      let g = 0
      let b = 0
      let a = 0
      let count = 0
      for (let k = 0; k < fontSize; k++) {
        for (let l = 0; l < fontSize; l++) {
          const rgba = getRGBA(data, x + k, y + l)
          r += rgba[0]
          g += rgba[1]
          b += rgba[2]
          a += rgba[3]
          count++
        }
      }
      colorRow.push(`rgba(${r / count},${g / count},${b / count},${a / count})`)
    }
    colors.push(colorRow)
  }

  return colors
}

/** 一个像素点的rgba */
type RGBA = [number, number, number, number]

export default {
  gaussianBlur,
  getTextColor,
}
