import React from 'react';
import { Button } from "@/components/ui/button"

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <h1 className="text-2xl font-bold">Hello World</h1>
      <Button>Click me</Button>
    </div>
  )
}

export default Home;