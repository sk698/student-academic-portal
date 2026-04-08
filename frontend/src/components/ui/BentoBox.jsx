import Card from './Card'

function BentoBox({ className, children }) {
  return <Card className={`h-full ${className ?? ''}`}>{children}</Card>
}

export default BentoBox
