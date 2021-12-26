import { ArrowsExpandIcon } from '@heroicons/react/outline'
import { CheckCircleIcon } from '@heroicons/react/outline'
import { ExternalLinkIcon } from '@heroicons/react/outline'
import Button from '../components/Button'

/*
  Post Component.
*/
export default function Post(props: Props) {
  const {
    index,
  } = props

  return (
    <div className="flex flex-col p-4 gap-y-4 hover:bg-gray-50">
      <div className="flex justify-between items-center cursor-pointer">
        <div className="flex gap-x-2">
          <div className="text-gray-400 text-lg">
            {index}.
          </div>

          <div className="flex flex-col">
            <h3 className="text-lg">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </h3>

            <h4 className="text-base text-gray-400">
              by kilariteja
            </h4>
          </div>
        </div>

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
            icon={ExternalLinkIcon}
          />
        </div>
      </div>
    </div>
  )
}

interface Props {
  index?: number
}
