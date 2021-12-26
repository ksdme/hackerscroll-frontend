import { ArrowsExpandIcon } from '@heroicons/react/outline'
import { CheckCircleIcon } from '@heroicons/react/outline'
import { UploadIcon } from '@heroicons/react/outline'
import Button from '../components/Button'

/*
  Post Component.
*/
export default function Post(props: Props) {
  const {
    index,
  } = props

  return (
    <div className="flex justify-between items-center p-5 hover:bg-gray-50">
      <h3 className="font-normal text-lg">
        <span className="text-gray-400">{index}. </span>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </h3>

      <div className="flex gap-x-4">
        <Button
          icon={ArrowsExpandIcon}
          label="Expand"
        />

        <Button
          icon={CheckCircleIcon}
          label="Read"
        />

        <Button
          icon={UploadIcon}
          label="Open"
        />
      </div>
    </div>
  )
}

interface Props {
  index?: number
}
