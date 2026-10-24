namespace Puzzle

/-- `rot = none` means the block has no direction; `some r` is a quarter-turn count (0 = up). -/
structure Cell where
  color : String
  rot : Option Nat
  deriving BEq, Inhabited

abbrev Board := Array (Array Cell)

inductive Op where
  | swap (x1 y1 x2 y2 : Nat)
  | paint (x y : Nat) (c : String)
  | rotate (x y : Nat)

def ofCells (cs : Array (Array (String × Option Nat))) : Board :=
  cs.map fun row => row.map fun (c, r) => { color := c, rot := r }

def inBounds (b : Board) (x y : Nat) : Bool :=
  y < b.size && x < (b[0]?.map (·.size)).getD 0

def getCell (b : Board) (x y : Nat) : Cell := (b[y]!)[x]!

def setCell (b : Board) (x y : Nat) (c : Cell) : Board :=
  b.set! y ((b[y]!).set! x c)

def oob (b : Board) (x y : Nat) : Except (List (Nat × Nat) × String) Unit :=
  if inBounds b x y then .ok ()
  else .error ([], s!"Illegal move: ({x}, {y}) is outside the board")

def apply (b : Board) : Op → Except (List (Nat × Nat) × String) Board
  | .swap x1 y1 x2 y2 => do
    oob b x1 y1; oob b x2 y2
    let a := getCell b x1 y1
    let c := getCell b x2 y2
    return setCell (setCell b x1 y1 c) x2 y2 a
  | .paint x y col => do
    oob b x y
    return setCell b x y { getCell b x y with color := col }
  | .rotate x y => do
    oob b x y
    let c := getCell b x y
    match c.rot with
    | none => throw ([], s!"Illegal move: block ({x}, {y}) has no direction to rotate")
    | some r => return setCell b x y { c with rot := some ((r + 1) % 4) }

def renderRot : Option Nat → String
  | none => "-"
  | some r => toString r

def render (b : Board) : String :=
  ";".intercalate (b.toList.map fun r =>
    ",".intercalate (r.toList.map fun c => s!"{c.color}:{renderRot c.rot}"))

/-- Replays the ops, printing one STEP line per op; returns the final board unless a move was illegal. -/
def runAll (b : Board) (ops : List (Nat × Op)) : IO (Option Board) := do
  let mut cur := b
  for (line, op) in ops do
    match apply cur op with
    | .ok nb =>
      cur := nb
      IO.println s!"STEP {line} {render cur}"
    | .error (_, msg) =>
      IO.println s!"ERROR {line}  {msg}"
      return none
  return some cur

/-- Replays the ops and then evaluates the level's win condition inside Lean. -/
def runChecked (b : Board) (ops : List (Nat × Op)) (valid : Board → Bool) : IO Unit := do
  match ← runAll b ops with
  | some final => IO.println s!"VALID {valid final}"
  | none => pure ()

/-! Property checks used by the generated `isValid`. -/

def cells (b : Board) : List Cell := b.toList.foldl (fun acc row => acc ++ row.toList) []

def countColor (b : Board) (c : String) : Nat :=
  (cells b).countP (·.color == c)

def noAdjacent (b : Board) (c : String) : Bool := Id.run do
  for y in [0:b.size] do
    for x in [0:(b[y]!).size] do
      if (getCell b x y).color == c then
        if x + 1 < (b[y]!).size && (getCell b (x + 1) y).color == c then return false
        if y + 1 < b.size && (getCell b x (y + 1)).color == c then return false
  return true

def rowsUniform (b : Board) : Bool :=
  b.all fun row => row.all fun c => c.color == (row[0]!).color

def symmetricH (b : Board) : Bool :=
  b.all fun row => (List.range row.size).all fun x => (row[x]!).color == (row[row.size - 1 - x]!).color

end Puzzle
