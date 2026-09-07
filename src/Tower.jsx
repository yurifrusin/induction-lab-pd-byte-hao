import { t, useLanguage } from './Language.jsx'
import { useMemo } from 'react'

const PEG_NAMES = ['A', 'B', 'C']
const DISK_COLORS = ['sky', 'teal', 'green', 'amber', 'coral']

const diskColor = (disk, total) => {
  const index = Math.max(0, DISK_COLORS.length - total + disk - 1)
  return DISK_COLORS[Math.min(index, DISK_COLORS.length - 1)]
}

export function Tower({
  count,
  hintMove,
  onMove,
  pegs,
  selectedPeg,
  setSelectedPeg,
}) {
  useLanguage()
  const topDisks = useMemo(
    () => pegs.map((peg) => peg[peg.length - 1]),
    [pegs],
  )

  const choosePeg = (pegIndex) => {
    if (selectedPeg === null) {
      if (pegs[pegIndex].length) setSelectedPeg(pegIndex)
      return
    }

    if (selectedPeg === pegIndex) {
      setSelectedPeg(null)
      return
    }

    onMove(selectedPeg, pegIndex)
  }

  const onDragStart = (event, pegIndex) => {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(pegIndex))
    setSelectedPeg(pegIndex)
  }

  const onDrop = (event, pegIndex) => {
    event.preventDefault()
    const from = Number(event.dataTransfer.getData('text/plain'))
    if (Number.isInteger(from)) onMove(from, pegIndex)
  }

  return (
    <div className="tower-shell" aria-label={t(`Tower of Hanoi with ${count} disc${count === 1 ? '' : 's'}`)}>
      <div className="tower-board">
        <div className="board-surface">
          {pegs.map((peg, pegIndex) => (
            <div
              className={`peg-zone ${selectedPeg === pegIndex ? 'is-selected' : ''} ${hintMove?.to === pegIndex ? 'is-hint-target' : ''}`}
              key={PEG_NAMES[pegIndex]}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => onDrop(event, pegIndex)}
            >
              <button
                aria-label={t(`Peg ${PEG_NAMES[pegIndex]}${selectedPeg !== null ? ', select as move destination' : ''}`)}
                className="peg-target-button"
                onClick={() => choosePeg(pegIndex)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    choosePeg(pegIndex)
                  }
                }}
                type="button"
              />
              <span className="target-ring" aria-hidden="true" />
              <span className="peg-cap" aria-hidden="true" />
              <span className="peg-rod" aria-hidden="true" />
              <span className="peg-name" aria-hidden="true">{PEG_NAMES[pegIndex]}</span>

              {peg.map((disk, diskIndex) => {
                const isTop = topDisks[pegIndex] === disk
                const isSelected = selectedPeg === pegIndex && isTop
                const color = diskColor(disk, count)
                const style = {
                  '--disk-index': diskIndex,
                  '--disk-width': `${44 + (disk / count) * 48}%`,
                }

                if (!isTop) {
                  return (
                    <span
                      aria-hidden="true"
                      className={`hanoi-disk disk-${color}`}
                      key={disk}
                      style={style}
                    />
                  )
                }

                return (
                  <button
                    aria-label={t(selectedPeg !== null && selectedPeg !== pegIndex
                        ? `Move selected disc to peg ${PEG_NAMES[pegIndex]}`
                        : `${isSelected ? 'Deselect' : 'Select'} disc ${disk} on peg ${PEG_NAMES[pegIndex]}`)}
                    className={`hanoi-disk disk-${color} is-top ${isSelected ? 'is-selected' : ''} ${hintMove?.from === pegIndex ? 'is-hint-source' : ''}`}
                    draggable
                    key={disk}
                    onClick={(event) => {
                      event.stopPropagation()
                      if (selectedPeg !== null && selectedPeg !== pegIndex) {
                        onMove(selectedPeg, pegIndex)
                      } else {
                        setSelectedPeg(isSelected ? null : pegIndex)
                      }
                    }}
                    onDragStart={(event) => onDragStart(event, pegIndex)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        event.stopPropagation()
                        if (selectedPeg !== null && selectedPeg !== pegIndex) {
                          onMove(selectedPeg, pegIndex)
                        } else {
                          setSelectedPeg(isSelected ? null : pegIndex)
                        }
                      }
                    }}
                    style={style}
                    type="button"
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function MiniTower({ stage = 'start', count = 4, number }) {
  useLanguage()
  const disks = Array.from({ length: count }, (_, index) => count - index)
  let distribution = [[], [], []]

  if (stage === 'clear') distribution = [[count + 1], disks, []]
  if (stage === 'largest') distribution = [[], disks, [count + 1]]
  if (stage === 'rebuild') distribution = [[], [], [count + 1, ...disks]]
  if (stage === 'start') distribution = [[count, ...disks.slice(1)], [], []]

  return (
    <div className="mini-tower-wrap" aria-hidden="true">
      {number && <span className="stage-number">{number}</span>}
      <div className="mini-tower">
        {distribution.map((peg, pegIndex) => (
          <div className="mini-peg" key={pegIndex}>
            <span className="mini-rod" />
            {peg.map((disk, diskIndex) => (
              <span
                className={`mini-disk disk-${diskColor(disk, count + 1)}`}
                key={`${disk}-${diskIndex}`}
                style={{
                  '--mini-index': diskIndex,
                  '--mini-width': `${34 + (disk / (count + 1)) * 62}%`,
                }}
              />
            ))}
          </div>
        ))}
        <span className="mini-base" />
      </div>
    </div>
  )
}
