const isValidDate = (date) => {
    const regex = /^(0[1-9]|[1-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/
    return regex.test(date)
}

export default isValidDate