import { Flex, SkeletonCircle, Td, Tr } from "@chakra-ui/react"

const rowHeight = '40px'

export const TableRowSkeleton = () => 
    <Tr _hover={{ bg: 'whiteAlpha.50' }}>
    <Td>
      <SkeletonCircle height={rowHeight} width='100%' />
    </Td>
    <Td>
      <SkeletonCircle height={rowHeight} width='100%' />
    </Td>
    <Td>
      <SkeletonCircle height={rowHeight} width='100%' />
    </Td>
    <Td>
      <SkeletonCircle height={rowHeight} width='100%' />
    </Td>
    <Td>
      <SkeletonCircle height={rowHeight} width='100%' />
    </Td>
    <Td>
      <Flex alignContent="center" gap={2}>
        <SkeletonCircle height={rowHeight} width='100%' />
        <SkeletonCircle height={rowHeight} width='100%' />
      </Flex>
    </Td>
  </Tr>