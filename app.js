const game = {
    xTurn: true,
    xState: [],
    oState: [],
    winningOutcomes: [
        ['0', '1', '2'],
        ['0', '3', '6'],
        ['0', '4', '8'],
        ['1', '4', '7'], 
        ['2', '4', '6'],
        ['2', '5', '8'],                
        ['3', '4', '5'],
        ['6', '7', '8']
    ]
}

document.addEventListener('click', event => {
    const target = event.target
    const isCell = target.classList.contains('grid-cell')
    const isDisabled = target.classList.contains('disabled')

    if (isCell && !isDisabled) {
        const cellValue = target.dataset.value

        game.xTurn === true
            ? game.xState.push(cellValue)
            : game.oState.push(cellValue)

        target.classList.add('disabled')
        target.classList.add(game.xTurn ? 'x' : 'o')

        game.xTurn = !game.xTurn

        if (!document.querySelectorAll('.grid-cell:not(.disabled)').length) {
            document.querySelector('.game-over').classList.add('visible')
            document.querySelector('.game-over-text').textContent = 'It is a tie!'
        }

        game.winningOutcomes.forEach(winningOutcome => {
            const xWins = winningOutcome.every(state => game.xState.includes(state))
            const oWins = winningOutcome.every(state => game.oState.includes(state))

            if (xWins || oWins) {
                document.querySelectorAll('.grid-cell').forEach(cell => cell.classList.add('disabled'))
                document.querySelector('.game-over').classList.add('visible')
                document.querySelector('.game-over-text').textContent = xWins
                    ? 'X is the winner!'
                    : 'O is the winner!'
            }
        })
    }
})

document.querySelector('.restart').addEventListener('click', () => {
    document.querySelector('.game-over').classList.remove('visible')
    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.classList.remove('disabled', 'x', 'o')
    })

    game.xTurn = true
    game.xState = []
    game.oState = []
})