import React from 'react';
import StickyBar from './StickyBar';

/*const reviews = [
    { text: "DJ Fire lit up the night!", author: "DJ Fire", image: 'https://images.pexels.com/photos/417458/pexels-photo-417458.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', id: 1 },
    { text: "Best DJ set I've ever heard!", author: "MusicLover", image: 'https://images.pexels.com/photos/358129/pexels-photo-358129.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',id :2 },
    { text: "DJ Mayank knows how to get the crowd moving.", author: "DJ Mayank", image: 'https://images.pexels.com/photos/3379257/pexels-photo-3379257.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' ,id :3 },
    { text: "Unforgettable beats by DJ Sparks!", author: "DJ Sparks", image: 'https://images.pexels.com/photos/3379257/pexels-photo-3379257.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',id:4 },
    { text: "DJ Groove kept the energy high all night.", author: "DJ Groove", image: 'https://images.pexels.com/photos/358129/pexels-photo-358129.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',id:5 },
    { text: "Amazing transitions, DJ Blaze!", author: "DJ Blaze", image: 'https://images.pexels.com/photos/3379257/pexels-photo-3379257.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',id:6 },
    { text: "DJ Vibe's mix was flawless.", author: "DJ Vibe", image: 'https://images.pexels.com/photos/3379257/pexels-photo-3379257.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',id:7 },
    { text: "DJ Spin's set was pure fire.", author: "DJ Spin", image: 'https://images.pexels.com/photos/358129/pexels-photo-358129.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',id:8 },
    { text: "Can't wait for DJ Tempo's next show!", author: "DJ Tempo", image: 'https://images.pexels.com/photos/3379257/pexels-photo-3379257.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',id:9 },
    { text: "DJ Rhythm brought the house down!", author: "DJ Rhythm", image: 'https://images.pexels.com/photos/417458/pexels-photo-417458.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',id:10 },
    { text: "DJ Pulse's beats are out of this world.", author: "DJ Pulse", image: 'https://images.pexels.com/photos/358129/pexels-photo-358129.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',id:11 },
    { text: "DJ Wave kept the party going strong.", author: "DJ Wave", image: 'https://images.pexels.com/photos/3379257/pexels-photo-3379257.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',id:12 },
    { text: "DJ Sonic's tracks were a hit.", author: "DJ Sonic", image: 'https://images.pexels.com/photos/417458/pexels-photo-417458.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',id:13 },
    { text: "Loved DJ Echo's set!", author: "DJ Echo", image: 'https://images.pexels.com/photos/358129/pexels-photo-358129.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',id:14 },
    { text: "DJ Flash had everyone dancing.", author: "DJ Flash", image: 'https://images.pexels.com/photos/358129/pexels-photo-358129.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' ,id :15 },
    // Add more reviews as needed
]; */

const reviews = [
    { id: 1, text: "DJ Fire lit up the night!", author: "DJ Fire", image: 'https://images.pexels.com/photos/417458/pexels-photo-417458.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: 2, text: "Best DJ set I've ever heard!", author: "MusicLover", image: 'https://images.pexels.com/photos/358129/pexels-photo-358129.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: 3, text: "DJ Mayank knows how to get the crowd moving.", author: "DJ Mayank", image: 'https://images.pexels.com/photos/3379257/pexels-photo-3379257.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: 4, text: "Unforgettable beats by DJ Sparks!", author: "DJ Sparks", image: 'https://images.pexels.com/photos/3379257/pexels-photo-3379257.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: 5, text: "DJ Groove kept the energy high all night.", author: "DJ Groove", image: 'https://images.pexels.com/photos/358129/pexels-photo-358129.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'},
    { id: 6, text: "Amazing transitions, DJ Blaze!", author: "DJ Blaze", image: 'https://images.pexels.com/photos/3379257/pexels-photo-3379257.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'},
    { id: 7, text: "DJ Vibe's mix was flawless.", author: "DJ Vibe", image: 'https://images.pexels.com/photos/3379257/pexels-photo-3379257.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'},
    { id: 8, text: "DJ Spin's set was pure fire.", author: "DJ Spin", image: 'https://images.pexels.com/photos/358129/pexels-photo-358129.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'},
    { id: 9, text: "Can't wait for DJ Tempo's next show!", author: "DJ Tempo", image: 'https://images.pexels.com/photos/3379257/pexels-photo-3379257.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: 10, text: "DJ Rhythm brought the house down!", author: "DJ Rhythm", image: 'https://images.pexels.com/photos/417458/pexels-photo-417458.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: 11, text: "DJ Pulse's beats are out of this world.", author: "DJ Pulse", image: 'https://images.pexels.com/photos/358129/pexels-photo-358129.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: 12, text: "DJ Wave kept the party going strong.", author: "DJ Wave", image: 'https://images.pexels.com/photos/3379257/pexels-photo-3379257.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: 13, text: "DJ Sonic's tracks were a hit.", author: "DJ Sonic", image: 'https://images.pexels.com/photos/417458/pexels-photo-417458.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'},
    { id: 14, text: "Loved DJ Echo's set!", author: "DJ Echo", image: 'https://images.pexels.com/photos/358129/pexels-photo-358129.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'},
    { id: 15, text: "DJ Flash had everyone dancing.", author: "DJ Flash", image: 'https://images.pexels.com/photos/358129/pexels-photo-358129.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    // ... more reviews
];



const Review = () => {
    return (
            <StickyBar type="review" data={reviews} />
    );
};

export default Review;