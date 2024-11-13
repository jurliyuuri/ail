const validateID = (ids: number[]) => {
  const [duplicated,] = ids.reduce((acc, id) => {
    const [duplicated, valueSet] = acc
    if (valueSet.has(id)) {
      duplicated.push(id)
    } else {
      valueSet.add(id)
    }
    return acc
  }, [new Array<number>, new Set<number>()])
  return duplicated
}

export default validateID