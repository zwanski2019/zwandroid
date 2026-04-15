export interface NDEFRecordDecoded {
  type: string
  mediaType?: string
  data: string
}

export interface NFCTagSignalRaw {
  serialNumber?: string
  records: NDEFRecordDecoded[]
}

