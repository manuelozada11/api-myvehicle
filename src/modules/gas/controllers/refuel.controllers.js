export const createRefuel = async (req, res) => {
    try {
        res.status(200).json({ code: 200, message: 'created_successfully' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ code: 500, message: 'internal_server_error' })
    }
}

export const getRefuelInfo = async (req, res) => {
    try {
        const { _id } = req.params
        res.status(200).json({ code: 200, message: 'connection_success', refuel: { _id } })
    } catch (err) {
        console.log(err)
        res.status(500).json({ code: 500, message: 'internal_server_error' })
    }
}

export const updateRefuel = async (req, res) => {
    try {
        const { _id } = req.params
        res.status(200).json({ code: 200, message: 'updated_successfully', refuel: { _id } })
    } catch (err) {
        console.log(err)
        res.status(500).json({ code: 500, message: 'internal_server_error' })
    }
}

export const deleteRefuel = async (req, res) => {
    try {
        const { _id } = req.params
        res.status(200).json({ code: 200, message: 'deleted_successfully', refuel: { _id } })
    } catch (err) {
        console.log(err)
        res.status(500).json({ code: 500, message: 'internal_server_error' })
    }
}