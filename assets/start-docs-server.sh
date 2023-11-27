# Function to handle the script's termination,
# killing both processes if this script is stopped.
terminate_processes() {
  echo "Caught signal! Killing both processes."
  kill -TERM "$process1" 2>/dev/null
  kill -TERM "$process2" 2>/dev/null
}

# Trap specific signals (SIGINT, SIGTERM, and SIGKILL) and handle them by calling the 'terminate_processes' function.
trap terminate_processes SIGINT SIGTERM

# Start your first program (let's call it 'program1') in the background,
# and get its process ID to a variable.
npm run start-server &
process1=$!

# Start your second program (let's call it 'program2') in the background,
# and get its process ID to a variable.
npm run watch  &
process2=$!

# Wait for both programs to finish.
wait $process1
wait $process2