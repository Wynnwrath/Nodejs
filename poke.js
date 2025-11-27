// const fetchPokemon = async (id) => {
//     try {
//     const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
//     console.log(await res.json());
//         } catch (error) {
//             console.error('Error fetching Pokémon data:', error);
//         }
// }


// fetchPokemon(1);


let myPromise = new Promise((resolve, reject) => {
    let condition = false;
    if (condition) {
        resolve('Promise resolved successfully');
    } else {
        reject('Promise rejected');
    }
});

myPromise.then((value) => {
    console.log(value);
}).catch((error) => {
    console.error(error);
})