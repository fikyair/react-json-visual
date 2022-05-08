import React, { forwardRef } from 'react'
import { useRef, useState } from 'react'
import KsSheet, { KsSheetProps } from './KsSheet'
import { EntityId } from './types'

interface KsUserSheetProps extends Omit<KsSheetProps, 'createSheet'> {}

const KsUserSheet = forwardRef((props: KsUserSheetProps, ref) => {
  const KsSheetRef = useRef<any>()
  const [entityId, setEntityId] = useState<EntityId>('')

  return <KsSheet {...props} ref={KsSheetRef} sheetEntityId={entityId} />
})

export default KsUserSheet
