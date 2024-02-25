const house = {
    "bar": [],
    "park": [],
    "jail": [],
    "school": [],
    "collage": [],
    "while": [],
    "house": []
};

export const remove_id_from_house = (id) => {
    for (const location in house) {
        const index = house[location].indexOf(id);
        if (index !== -1) {
            house[location].splice(index, 1);
            console.log(`Removed ID ${id} from ${location}`);
            return;
        }
    }
    console.log(`ID ${id} not found in any location.`);
};

export const add_id_to_room = (id,room) => {
    house[room].push(id)
}