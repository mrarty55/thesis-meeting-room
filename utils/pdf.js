import pdfMake from 'pdfmake/build/pdfmake'
import numeral from 'numeral'
import { format } from 'date-fns'
import vfs from './vfs'

const font = {
  NotoSans: {
    normal: 'NotoSans-Regular.ttf',
    bold: 'NotoSans-Bold.ttf',
  },
  NotoSansLa: {
    normal: 'NotoSansLao-Regular.ttf',
    bold: 'NotoSansLao-Bold.ttf',
  },
  SaysetthaOT: {
    normal: 'saysettha_ot.ttf',
    bold: 'saysettha_ot.ttf',
  },
}

export function generateContract(data) {
  const roomsTableBody = [['ລ.', 'ຊື່ຫ້ອງ']]
  const equipmentsTableBody = [['ລ.', 'ຊື່ອຸປະກອນ']]
  const drinksTableBody = [['ລ.', 'ຊື່ເຄື່ອງດື່ມ', 'ຈຳນວນ']]

  data.rooms.forEach((item, index) =>
    roomsTableBody.push([index + 1, item.name])
  )
  if (data.equipments) {
    data.equipments.forEach((item, index) =>
      equipmentsTableBody.push([index + 1, item.name])
    )
  }
  if (data.drinks) {
    data.drinks.forEach((item, index) =>
      drinksTableBody.push([index + 1, item.name, item.amount])
    )
  }

  const documentDefinition = {
    pageSize: 'A4',
    defaultStyle: {
      font: 'SaysetthaOT',
      lineHeight: 1.5,
    },
    content: [
      { image: 'varee-cafe.jpg', width: 100, heigth: 100, alignment: 'center' },
      {
        text: 'ສັນຍາຈອງຫ້ອງປະຊຸມ',
        bold: true,
        fontSize: 24,
        alignment: 'center',
        margin: [0, 5, 0, 5],
      },
      {
        columns: [
          { text: 'ລະຫັດການຈອງ:', bold: true, width: 'auto' },
          {
            text: `B${numeral(data.id).format('000')}`,
            width: 'auto',
            margin: [5, 0, 0, 0],
          },
        ],
      },
      {
        layout: 'noBorders',
        table: {
          widths: ['auto', '*', 'auto', '*'],
          body: [
            [
              { text: 'ຊື່ຜູ້ເຊົ່າ:', bold: true },
              `${data.customer.firstName} ${data.customer.lastName}`,
              { text: 'ຕຳແໜ່ງ:', bold: true },
              data.customer.occupation,
            ],
          ],
        },
      },
      {
        layout: 'noBorders',
        table: {
          widths: ['auto', '*', 'auto', '*'],
          body: [
            [
              { text: 'ໝາຍເລກໂທລະສັບ:', bold: true },
              data.customer.phoneNumber,
              { text: 'ອີເມວ:', bold: true },
              data.customer.email,
            ],
          ],
        },
      },
      {
        layout: 'noBorders',
        table: {
          widths: ['auto', '*', 'auto', '*'],
          body: [
            [
              { text: 'ຫົວຂໍ້ງານ:', bold: true },
              data.eventTitle,
              { text: 'ປະເພດງານ:', bold: true },
              data.eventType.name,
            ],
          ],
        },
      },
      {
        layout: 'noBorders',
        table: {
          widths: ['auto', '*', 'auto', '*'],
          body: [
            [
              { text: 'ວັນທີຈັດງານ:', bold: true },
              format(new Date(data.eventDate), 'dd/MM/yyyy'),
              { text: 'ເວລາ:', bold: true },
              `${data.eventStartTime.substr(0, 5)} - ${data.eventEndTime.substr(
                0,
                5
              )}`,
            ],
          ],
        },
      },
      { text: 'ຂໍ້ມູນຫ້ອງ', bold: true, margin: [0, 5, 0, 5] },
      roomsTableBody.length > 1
        ? {
            table: {
              widths: ['auto', '*'],
              headerRows: 1,
              body: roomsTableBody,
            },
          }
        : { text: 'ບໍ່ມີຂໍ້ມູນ' },
      { text: 'ຂໍ້ມູນອຸປະກອນ', bold: true, margin: [0, 5, 0, 5] },
      equipmentsTableBody.length > 1
        ? {
            table: {
              widths: ['auto', '*'],
              headerRows: 1,
              body: equipmentsTableBody,
            },
          }
        : { text: 'ບໍ່ມີອຸປະກອນ' },
      { text: 'ຂໍ້ມູນເຄື່ອງດື່ມ', bold: true, margin: [0, 5, 0, 5] },
      drinksTableBody.length > 1
        ? {
            table: {
              widths: ['auto', '*', '*'],
              headerRows: 1,
              body: drinksTableBody,
            },
          }
        : { text: 'ບໍ່ມີເຄື່ີອງດື່ມ' },
      {
        layout: 'noBorders',
        margin: [0, 5, 0, 5],
        table: {
          body: [
            [
              { text: 'ຮູບແບບຫ້ອງ:', bold: true },
              data.roomStyle.name,
              { text: 'ຈຳນວນໂຕະ:', bold: true },
              data.table,
              { text: 'ຈຳນວນຕັ່ງ:', bold: true },
              data.chair,
            ],
          ],
        },
      },
      {
        layout: 'noBorders',
        table: {
          body: [
            [
              { text: 'ຂໍ້ຄວາມເສີມ:', bold: true },
              { text: data.additionalNote ? data.additionalNote : '-' },
            ],
          ],
        },
      },
      {
        columns: [
          {
            text: 'ເຊັນຜູ້ຈັດການຮ້ານ',
            margin: [50, 50, 0, 0],
            alignment: 'left',
          },
          { text: 'ເຊັນຜູ້ເຊົ່າ', margin: [0, 50, 50, 0], alignment: 'right' },
        ],
      },
    ],
  }

  pdfMake.createPdf(documentDefinition, null, font, vfs.pdfMake.vfs).open()
}

export function generateQuotation(data) {
  const itemTableBody = [['ລາຍການ', 'ລາຄາ']]
  const sumTableBody = [
    ['ລວມທັງໝົດ', `${numeral(data.total).format('0,0[.]00')} ກີບ`],
    ['ຄ່າມັດຈຳທີ່ຕ້ອງຈ່າຍ', `${numeral(data.deposit).format('0,0[.]00')} ກີບ`],
  ]
  let roomString = ''
  let equipmentString = ''
  let drinkString = ''

  data.rooms.forEach((item, index, arr) => {
    if (index !== arr.length - 1) {
      roomString += `${item.name}, `
    } else {
      roomString += `${item.name}.`
    }
  })
  if (data.equipments && data.equipments !== {}) {
    data.equipments.forEach((item, index, arr) => {
      if (index !== arr.length - 1) {
        equipmentString += `${item.name}, `
      } else {
        equipmentString += `${item.name}.`
      }
    })
  }
  if (data.drinks && data.drinks !== {}) {
    data.drinks.forEach((item, index, arr) => {
      if (index !== arr.length - 1) {
        drinkString += `${item.name} ຈຳນວນ ${item.amount} ຈອກ, `
      } else {
        drinkString += `${item.name} ຈຳນວນ ${item.amount} ຈອກ.`
      }
    })
  }

  itemTableBody.push([
    `ຄ່າຈອງ ${roomString}`,
    `${numeral(data.roomSubtotal).format('0,0[.]00')} ກີບ`,
  ])
  itemTableBody.push([`ອຸປະກອນ: ${equipmentString}`, '-'])
  itemTableBody.push([
    `ເຄື່ອງດື່ມ: ${drinkString}`,
    `${numeral(data.drinkSubtotal).format('0,0[.]00')} ກີບ`,
  ])

  const documentDefinition = {
    pageSize: 'A4',
    defaultStyle: {
      font: 'SaysetthaOT',
      lineHeight: 1.5,
    },
    content: [
      { image: 'varee-cafe.jpg', width: 100, heigth: 100, alignment: 'center' },
      {
        text: 'ໃບສະເໜີລາຄາ',
        bold: true,
        fontSize: 24,
        alignment: 'center',
        margin: [0, 5, 0, 5],
      },
      {
        layout: 'noBorders',
        table: {
          widths: ['auto', '*', 'auto', '*'],
          body: [
            [
              { text: 'ຊື່ຜູ້ເຊົ່າ:', bold: true },
              data.customer.firstName && data.customer.lastName
                ? `${data.customer.firstName} ${data.customer.lastName}`
                : `${data.customer.name}`,
              { text: 'ຕຳແໜ່ງ:', bold: true },
              data.customer.occupation,
            ],
          ],
        },
      },
      {
        layout: 'noBorders',
        table: {
          widths: ['auto', '*'],
          body: [[{ text: 'ຫົວຂໍ້ງານ:', bold: true }, data.eventTitle]],
        },
      },
      {
        layout: 'noBorders',
        table: {
          widths: ['auto', '*', 'auto', '*'],
          body: [
            [
              { text: 'ວັນທີຈັດງານ:', bold: true },
              format(new Date(data.eventDate), 'dd/MM/yyyy'),
              { text: 'ເວລາ:', bold: true },
              `${data.eventStartTime.substr(0, 5)} - ${data.eventEndTime.substr(
                0,
                5
              )}`,
            ],
          ],
        },
      },
      {
        table: {
          margin: [0, 5, 0, 5],
          widths: ['50%', '50%'],
          body: itemTableBody,
        },
      },
      {
        margin: [0, 5, 0, 5],
        table: {
          widths: ['50%', '50%'],
          body: sumTableBody,
        },
      },
      {
        columns: [
          {
            text: 'ເຊັນຜູ້ຈັດການຮ້ານ',
            margin: [50, 50, 0, 0],
            alignment: 'left',
          },
          { text: 'ເຊັນຜູ້ເຊົ່າ', margin: [0, 50, 50, 0], alignment: 'right' },
        ],
      },
    ],
  }

  pdfMake.createPdf(documentDefinition, null, font, vfs.pdfMake.vfs).open()
}

export function generateReceipt(data) {
  const itemTableBody = [['ລາຍການ', 'ລາຄາ']]
  const sumTableBody = [
    ['ລວມທັງໝົດ', `${numeral(data.total).format('0,0[.]00')} ກີບ`],
    ['ຈ່າຍລ່ວງໜ້າແລ້ວ', `${numeral(data.deposit).format('0,0[.]00')} ກີບ`],
    [
      'ມູນຄ່າທີ່ຈ່າຍຕື່ມ',
      `${numeral(data.total - data.deposit).format('0,0[.]00')} ກີບ`,
    ],
    ['ຮັບເງິນ', `${numeral(data.received).format('0,0[.]00')} ກີບ`],
    ['ທອນເງິນ', `${numeral(data.change).format('0,0[.]00')} ກີບ`],
  ]
  let roomString = ''
  let equipmentString = ''
  let drinkString = ''

  data.rooms.forEach((item, index, arr) => {
    if (index !== arr.length - 1) {
      roomString += `${item.name}, `
    } else {
      roomString += `${item.name}.`
    }
  })
  if (data.equipments) {
    data.equipments.forEach((item, index, arr) => {
      if (index !== arr.length - 1) {
        equipmentString += `${item.name}, `
      } else {
        equipmentString += `${item.name}.`
      }
    })
  }
  if (data.drinks) {
    data.drinks.forEach((item, index, arr) => {
      if (index !== arr.length - 1) {
        drinkString += `${item.name} ຈອກ, `
      } else {
        drinkString += `${item.name} ຈອກ.`
      }
    })
  }

  itemTableBody.push([
    `ຄ່າຈອງ ${roomString}`,
    `${numeral(data.roomSubtotal).format('0,0[.]00')} ກີບ`,
  ])
  itemTableBody.push([`ອຸປະກອນ: ${equipmentString}`, '-'])
  itemTableBody.push([
    `ເຄື່ອງດື່ມ: ${drinkString}`,
    `${numeral(data.drinkSubtotal).format('0,0[.]00')} ກີບ`,
  ])

  const documentDefinition = {
    pageSize: 'A4',
    defaultStyle: {
      font: 'SaysetthaOT',
      lineHeight: 1.5,
    },
    content: [
      { image: 'varee-cafe.jpg', width: 100, heigth: 100, alignment: 'center' },
      {
        text: 'ໃບບິນ',
        bold: true,
        fontSize: 24,
        alignment: 'center',
        margin: [0, 5, 0, 5],
      },
      {
        layout: 'noBorders',
        table: {
          widths: ['auto', '*', 'auto', '*', 'auto', '*'],
          body: [
            [
              { text: 'ຫົວຂໍ້ງານ:', bold: true },
              data.eventTitle,
              { text: 'ວັນທີຈັດງານ:', bold: true },
              format(new Date(data.eventDate), 'dd/MM/yyyy'),
              { text: 'ເວລາ:', bold: true },
              `${data.eventStartTime.substr(0, 5)} - ${data.eventEndTime.substr(
                0,
                5
              )}`,
            ],
          ],
        },
      },
      {
        layout: 'noBorders',
        table: {
          widths: ['auto', '*', 'auto', '*'],
          body: [
            [
              { text: 'ຊື່ຜູ້ເຊົ່າ:', bold: true },
              `${data.customer.firstName} ${data.customer.lastName}`,
              { text: 'ຕຳແໜ່ງ:', bold: true },
              data.customer.occupation,
            ],
          ],
        },
      },
      {
        table: {
          margin: [0, 5, 0, 5],
          widths: ['50%', '50%'],
          body: itemTableBody,
        },
      },
      {
        margin: [0, 5, 0, 5],
        table: {
          widths: ['50%', '50%'],
          body: sumTableBody,
        },
      },
      {
        columns: [
          {
            text: 'ເຊັນຜູ້ຈັດການຮ້ານ',
            margin: [50, 50, 0, 0],
            alignment: 'left',
          },
          { text: 'ເຊັນຜູ້ເຊົ່າ', margin: [0, 50, 50, 0], alignment: 'right' },
        ],
      },
    ],
  }

  pdfMake.createPdf(documentDefinition, null, font, vfs.pdfMake.vfs).open()
}

export function generateBookingReport(data) {
  const tableBody = [
    ['ລຳດັບ', 'ຫົວຂໍ້ງານ', 'ຮູບແບບງານ', 'ວັນທີຈັດງານ', 'ເວລາຈອງ'],
  ]

  data.forEach((item, index) => {
    tableBody.push([
      index + 1,
      item.eventTitle,
      item.eventType,
      format(new Date(item.eventDate), 'dd/MM/yyyy'),
      format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm:ss'),
    ])
  })

  const documentDefinition = {
    pageSize: 'A4',
    defaultStyle: {
      font: 'SaysetthaOT',
      lineHeight: 1.5,
    },
    content: [
      { image: 'varee-cafe.jpg', width: 100, heigth: 100, alignment: 'center' },
      {
        text: 'ລາຍງານການຈອງ',
        bold: true,
        fontSize: 24,
        alignment: 'center',
        margin: [0, 5, 0, 5],
      },
      {
        table: {
          widths: ['auto', '*', '*', '*', '*'],
          body: tableBody,
        },
      },
    ],
  }

  pdfMake.createPdf(documentDefinition, null, font, vfs.pdfMake.vfs).open()
}

export function generateRentReport(data) {
  const tableBody = [['ລຳດັບ', 'ຫົວຂໍ້ງານ', 'ເວລາແຈ້ງເຂົ້າ']]

  data.forEach((item, index) => {
    tableBody.push([
      index + 1,
      item.eventTitle,
      format(new Date(item.checkinAt), 'dd/MM/yyyy HH:mm:ss'),
    ])
  })

  const documentDefinition = {
    pageSize: 'A4',
    defaultStyle: {
      font: 'SaysetthaOT',
      lineHeight: 1.5,
    },
    content: [
      { image: 'varee-cafe.jpg', width: 100, heigth: 100, alignment: 'center' },
      {
        text: 'ລາຍງານການເຊົ່າ',
        bold: true,
        fontSize: 24,
        alignment: 'center',
        margin: [0, 5, 0, 5],
      },
      {
        table: {
          widths: ['auto', '*', '*'],
          body: tableBody,
        },
      },
    ],
  }

  pdfMake.createPdf(documentDefinition, null, font, vfs.pdfMake.vfs).open()
}

export function generateRevenueReport(data) {
  const overallTableBody = [
    ['ລວມທັງໝົດ', `${numeral(data.overall.total).format('0,0[.]00')} ກີບ`],
    [
      'ມູນຄ່າການຈອງຫ້ອງ',
      `${numeral(data.overall.roomSubtotal).format('0,0[.]00')} ກີບ`,
    ],
    [
      'ມູນຄ່າເຄື່ອງດື່ມ',
      `${numeral(data.overall.drinkSubtotal).format('0,0[.]00')} ກີບ`,
    ],
  ]
  const confirmedTableBody = [
    ['ລວມທັງໝົດ', `${numeral(data.confirmed.total).format('0,0[.]00')} ກີບ`],
    [
      'ມູນຄ່າການຈອງຫ້ອງ',
      `${numeral(data.confirmed.roomSubtotal).format('0,0[.]00')} ກີບ`,
    ],
    [
      'ມູນຄ່າເຄື່ອງດື່ມ',
      `${numeral(data.confirmed.drinkSubtotal).format('0,0[.]00')} ກີບ`,
    ],
  ]
  const checkedinTableBody = [
    ['ລວມທັງໝົດ', `${numeral(data.checkedin.total).format('0,0[.]00')} ກີບ`],
    [
      'ມູນຄ່າການຈອງຫ້ອງ',
      `${numeral(data.checkedin.roomSubtotal).format('0,0[.]00')} ກີບ`,
    ],
    [
      'ມູນຄ່າເຄື່ອງດື່ມ',
      `${numeral(data.checkedin.drinkSubtotal).format('0,0[.]00')} ກີບ`,
    ],
  ]

  const documentDefinition = {
    pageSize: 'A4',
    defaultStyle: {
      font: 'SaysetthaOT',
      lineHeight: 1.5,
    },
    content: [
      { image: 'varee-cafe.jpg', width: 100, heigth: 100, alignment: 'center' },
      {
        text: 'ລາຍງານລາຍຮັບ',
        bold: true,
        fontSize: 24,
        alignment: 'center',
        margin: [0, 5, 0, 5],
      },
      { text: 'ລາຍຮັບໂດຍລວມ', bold: true, margin: [0, 5, 0, 5] },
      {
        table: {
          widths: ['auto', '*'],
          body: overallTableBody,
        },
      },
      { text: 'ການຈອງທີ່ຢືນຢັນແລ້ວ', bold: true, margin: [0, 5, 0, 5] },
      {
        table: {
          widths: ['auto', '*'],
          body: confirmedTableBody,
        },
      },
      { text: 'ການຈອງທີ່ແຈ້ງເຂົ້າແລ້ວ', bold: true, margin: [0, 5, 0, 5] },
      {
        table: {
          widths: ['auto', '*'],
          body: checkedinTableBody,
        },
      },
    ],
  }

  pdfMake.createPdf(documentDefinition, null, font, vfs.pdfMake.vfs).open()
}

export function generateRoomReport(data) {
  const tableBody = [['ລຳດັບ', 'ຊື່ຫ້ອງ', 'ຍອດຈອງ', 'ລວມຊົ່ວໂມງຈອງ']]

  data.forEach((item, index) => {
    tableBody.push([
      index + 1,
      item.name,
      `${item.bookingCount} ເທື່ອ`,
      `${Math.floor(item.bookingHours)} ຊົ່ວໂມງ`,
    ])
  })

  const documentDefinition = {
    pageSize: 'A4',
    defaultStyle: {
      font: 'SaysetthaOT',
      lineHeight: 1.5,
    },
    content: [
      { image: 'varee-cafe.jpg', width: 100, heigth: 100, alignment: 'center' },
      {
        text: 'ລາຍງານຫ້ອງປະຊຸມ',
        bold: true,
        fontSize: 24,
        alignment: 'center',
        margin: [0, 5, 0, 5],
      },
      {
        table: {
          widths: ['auto', '*', '*', '*'],
          body: tableBody,
        },
      },
    ],
  }

  pdfMake.createPdf(documentDefinition, null, font, vfs.pdfMake.vfs).open()
}

export function generateEquipmentReport(data) {
  const tableBody = [['ລຳດັບ', 'ຊື່ອຸປະກອນ', 'ຍອດນຳໃຊ້']]

  data.forEach((item, index) => {
    tableBody.push([index + 1, item.name, `${item.bookingCount} ເທື່ອ`])
  })

  const documentDefinition = {
    pageSize: 'A4',
    defaultStyle: {
      font: 'SaysetthaOT',
      lineHeight: 1.5,
    },
    content: [
      { image: 'varee-cafe.jpg', width: 100, heigth: 100, alignment: 'center' },
      {
        text: 'ລາຍງານອຸປະກອນ',
        bold: true,
        fontSize: 24,
        alignment: 'center',
        margin: [0, 5, 0, 5],
      },
      {
        table: {
          widths: ['auto', '*', '*'],
          body: tableBody,
        },
      },
    ],
  }

  pdfMake.createPdf(documentDefinition, null, font, vfs.pdfMake.vfs).open()
}

export function generateDrinkReport(data) {
  const tableBody = [['ລຳດັບ', 'ຊື່ເຄື່ອງດື່ມ', 'ຍອດຂາຍ', 'ລວມມູນຄ່າ']]

  data.forEach((item, index) => {
    tableBody.push([
      index + 1,
      item.name,
      `${item.sellCount} ຈອກ`,
      `${numeral(item.sellTotal).format('0,0[.]00')} ກີບ`,
    ])
  })

  const documentDefinition = {
    pageSize: 'A4',
    defaultStyle: {
      font: 'SaysetthaOT',
      lineHeight: 1.5,
    },
    content: [
      { image: 'varee-cafe.jpg', width: 100, heigth: 100, alignment: 'center' },
      {
        text: 'ລາຍງານເຄື່ອງດື່ມ',
        bold: true,
        fontSize: 24,
        alignment: 'center',
        margin: [0, 5, 0, 5],
      },
      {
        table: {
          widths: ['auto', '*', '*', '*'],
          body: tableBody,
        },
      },
    ],
  }

  pdfMake.createPdf(documentDefinition, null, font, vfs.pdfMake.vfs).open()
}
