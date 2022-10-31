import { ProfileBadgesGroup } from '@components/Profile'
import { IProfileBadge } from 'src/types/profile'
import { fireEvent, render, screen, within } from 'src/utils/test-utils'

// fix mantine bug with popover
window.ResizeObserver =
	window.ResizeObserver ||
	jest.fn().mockImplementation(() => ({
		disconnect: jest.fn(),
		observe: jest.fn(),
		unobserve: jest.fn(),
	}))

const badges: IProfileBadge[] = [
	{
		id: '1',
		label: 'React',
	},
	{
		id: '2',
		label: 'Next.js',
	},
]

describe('ProfileBadgesGroup', () => {
	it('should render', () => {
		const { container } = render(
			<ProfileBadgesGroup badges={badges} title="test" />
		)

		expect(container).toBeInTheDocument()
	})

	it('should add item', () => {
		render(<ProfileBadgesGroup badges={badges} title="test" />)
		let badgesElements = screen.getAllByTestId('badge')
		expect(badgesElements).toHaveLength(2)

		const addButton = screen.getByTestId('add-badge')
		fireEvent.click(addButton)

		const input = screen.getByLabelText('label')
		const addButtonSubmit = screen.getByTestId('add-badge-submit')

		fireEvent.change(input, { target: { value: 'test badge' } })
		fireEvent.click(addButtonSubmit)

		const badge = screen.getByText('test badge')
		badgesElements = screen.getAllByTestId('badge')

		expect(input).not.toBeInTheDocument()
		expect(badge).toBeInTheDocument()
		expect(badgesElements).toHaveLength(3)
	})

	it('should remove item', () => {
		render(<ProfileBadgesGroup badges={badges} title="test" />)
		let badgesElements = screen.getAllByTestId('badge')
		expect(badgesElements).toHaveLength(2)

		const firstBadge = badgesElements[0]

		const removeButton = within(firstBadge).getByTestId('delete-badge')
		fireEvent.click(removeButton)

		const removeButtonSubmit = within(firstBadge).getByTestId(
			'delete-badge-submit'
		)
		fireEvent.click(removeButtonSubmit)

		badgesElements = screen.getAllByTestId('badge')
		expect(badgesElements).toHaveLength(1)
	})

	it('should not update badge on cancel editing', () => {
		render(<ProfileBadgesGroup badges={badges} title="test" />)

		const badge = screen.getAllByTestId('badge')[0]
		expect(badge).toHaveTextContent('React')

		const updateButton = within(badge).getByTestId('update-badge')
		fireEvent.click(updateButton)

		const updateButtonClose = within(badge).getByTestId('update-badge-close')
		const input = within(badge).getByTestId('update-badge-input')

		fireEvent.change(input, { target: { value: 'test badge' } })
		fireEvent.click(updateButtonClose)

		expect(badge).toHaveTextContent('React')
	})

	it('should edit item', () => {
		render(<ProfileBadgesGroup badges={badges} title="test" />)

		const badge = screen.getAllByTestId('badge')[0]
		expect(badge).toHaveTextContent('React')

		const updateButton = within(badge).getByTestId('update-badge')
		fireEvent.click(updateButton)

		const updateButtonSubmit = within(badge).getByTestId(
			'update-badge-submit'
		)
		const input = within(badge).getByTestId('update-badge-input')

		fireEvent.change(input, { target: { value: 'test badge' } })
		fireEvent.click(updateButtonSubmit)

		expect(badge).toHaveTextContent('test badge')
	})
})
