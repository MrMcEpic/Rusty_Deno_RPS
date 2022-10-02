use rand::Rng;
#[no_mangle]
pub extern "C" fn player_pick(x: u8) -> u8 {
    logic(x)
}

fn logic(x: u8) -> u8 {
    // 0 = tie, 1 = win, 2 = lose
    let mut rng = rand::thread_rng();
    let y: u8 = rng.gen_range(0..3);
    match x {
        0 => match y {
            0 => 0, // Rock vs Rock tie
            1 => 2, // Rock vs Paper lose
            2 => 1, // Rock vs Scissors win
            _ => 0,
        },
        1 => match y {
            0 => 1,
            1 => 0,
            2 => 2,
            _ => 0,
        },
        2 => match y {
            0 => 2,
            1 => 1,
            2 => 0,
            _ => 0,
        },
        _ => 0,
    }
}
