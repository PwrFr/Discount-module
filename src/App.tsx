import { useEffect, useState } from 'react';
import './App.css';
import { Button } from './components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

import { ChevronRight, ShoppingCart, Ticket } from 'lucide-react';
import { Plus, Minus } from 'lucide-react';

import WhiteHP from '@/assets/images/8384691-a1-Photoroom.png';
import BlackHP from '@/assets/images/SONY-1-Photoroom.png';
import Glasses from '@/assets/images/11001_OSLO_01_2_1-Photoroom.png';
import WhiteTShirt from '@/assets/images/01887455250-e1.jpg';
import BaggyJeans from '@/assets/images/04365402802-e1.jpg';
import LeatherJacket from '@/assets/images/05479100800-e1.jpg';
import Perfumes from '@/assets/images/20210736999-e1.jpg';
import LeatherLoafers from '@/assets/images/12600520800-ult21.jpg';
import LeatherBelt from '@/assets/images/02823300800-081-e1.jpg';
type Product = {
    id: string;
    image: string;
    name: string;
    price: number;
    currency: string;
    category: string;
};
type Cart = {
    id: string;
    amount: number;
};

type itemDetail = {
    id: string;
    image: string;
    name: string;
    category: string;
    currency: string;
    price: number;
    amount: number;
    totalPrice: number;
};

type Coupon = {
    id: string;
    type: string;
    discount: number;
};

type onTop = {
    id: string;
    type: string;
    category?: string[];
    amount?: number;
};
function App() {
    const [product] = useState<Product[]>([
        {
            id: '0',
            image: WhiteTShirt,
            name: 'Casual T-Shirt',
            price: 250,
            currency: 'THB',
            category: 'Clothing',
        },
        {
            id: '1',
            image: BaggyJeans,
            name: 'Baggy Jeans',
            price: 1450,
            currency: 'THB',
            category: 'Clothing',
        },
        {
            id: '2',
            image: LeatherJacket,
            name: 'Leather Jacket',
            price: 2900,
            currency: 'THB',
            category: 'Clothing',
        },
        {
            id: '3',
            image: Glasses,
            name: 'Glasses',
            price: 1950,
            currency: 'THB',
            category: 'Accessories',
        },
        {
            id: '4',
            image: Perfumes,
            name: 'Zara Gold',
            price: 3950,
            currency: 'THB',
            category: 'Perfume',
        },
        {
            id: '5',
            image: LeatherLoafers,
            name: 'Leather Loafers',
            price: 1230,
            currency: 'THB',
            category: 'Footwear',
        },
        {
            id: '6',
            image: LeatherBelt,
            name: 'Basic Leather Belt',
            price: 1290,
            currency: 'THB',
            category: 'Accessories',
        },
        {
            id: '7',
            image: WhiteHP,
            name: 'Headphones White',
            price: 12490,
            currency: 'THB',
            category: 'Electronics',
        },
        {
            id: '8',
            image: BlackHP,
            name: 'Headphones Black',
            price: 5490,
            currency: 'THB',
            category: 'Electronics',
        },
    ]);

    const [cart, setCart] = useState<Cart[]>([]);

    const increaseCart = (e: Product | Cart) => {
        setCart((prev) => {
            const foundIndex = prev.findIndex((item) => item.id === e.id);

            if (foundIndex < 0) {
                // Item not found, add new item with amount 1
                return [
                    {
                        id: e.id,
                        amount: 1,
                    },
                    ...prev,
                ];
            } else {
                // Item found, create a new array with the updated item
                return prev.map((item, index) =>
                    index === foundIndex
                        ? { ...item, amount: item.amount + 1 }
                        : item
                );
            }
        });
    };

    const decreaseCart = (e: Product | Cart) => {
        setCart((prev) => {
            const foundIndex = prev.findIndex((item) => item.id === e.id);
            if (foundIndex < 0) {
                // Item not found, return unchanged array
                return prev;
            }

            // Check if amount is 1 (about to be removed)
            if (prev[foundIndex].amount === 1) {
                // Remove the item by filtering it out
                return prev.filter((item) => item.id !== e.id);
            } else {
                // Item found, create a new array with the updated item
                return prev.map((item, index) =>
                    index === foundIndex
                        ? { ...item, amount: item.amount - 1 }
                        : item
                );
            }
        });
    };

    const [openOffer, setOpenOffer] = useState<boolean>(false);

    // Coupon
    // Fixed amount
    const couponAmount = 50;
    // Percentage discount
    const couponPercentage = 10;

    const coupon: Coupon[] = [
        {
            id: '50fixedamount',
            type: 'amount',
            discount: 50,
        },
        {
            id: '10percentagediscount',
            type: 'percentage',
            discount: 10,
        },
    ];

    const [selectedCoupon, setSelectedCoupon] = useState<Coupon>();
    const onSelectCoupon = (coupon: Coupon) => {
        if (selectedCoupon?.id == coupon.id) {
            setSelectedCoupon(undefined);
        } else {
            setSelectedCoupon(coupon);
        }
        // setOpenOffer(false);
    };

    const couponDiscount = (): number => {
        if (!selectedCoupon) return 0;

        if (selectedCoupon.type == 'amount') {
            return couponAmount;
        } else {
            return (
                cartWithDetails.reduce(
                    (sum, item) => sum + item.totalPrice,
                    0
                ) *
                (couponPercentage / 100)
            );
        }
    };

    // Ontop
    // Percentage discount by item category
    const onTopAmount = 15;
    const categoryList = ['Clothing', 'Accessories'];
    // Discount by points
    const userPoint = 284;

    const onTop = [
        {
            id: 'itemcategory',
            type: 'category',
            amount: 15,
            disabled: (cart: itemDetail[]) =>
                !cart.some((product) =>
                    categoryList.includes(product.category)
                ),
        },
        {
            id: 'userpoint',
            type: 'point',
        },
    ];

    const [selectedOnTop, setSelectedOnTop] = useState<onTop>();
    const onSelectOnTop = (onTop: onTop) => {
        if (selectedOnTop?.id == onTop.id) {
            setSelectedOnTop(undefined);
        } else {
            setSelectedOnTop(onTop);
        }
    };

    const onTopDiscount = (): number => {
        if (selectedOnTop?.type == 'point') {
            return subTotal * 0.2 > userPoint ? userPoint : subTotal * 0.2;
        } else {
            return (
                cartWithDetails
                    .filter((item) => categoryList.includes(item.category))
                    .reduce((sum, item) => sum + item.totalPrice, 0) *
                (onTopAmount / 100)
            );
        }
    };

    // Seasonal
    const seasonalSpend = 300;
    const seasonalAmount = 40;

    const seasonalDiscount = () => {
        return Math.floor(subTotal / seasonalSpend) * seasonalAmount;
    };

    const [cartWithDetails, setCartWithDetails] = useState<itemDetail[]>([]);

    useEffect(() => {
        if (cart.length == 0) {
            setSelectedCoupon(undefined);
            setSelectedOnTop(undefined);
        }

        const detailedCart = cart
            .map((cartItem) => {
                const products = product.find(
                    (product) => product.id === cartItem.id
                );
                return products
                    ? {
                          ...products,
                          amount: cartItem.amount,
                          totalPrice: products.price * cartItem.amount,
                      }
                    : null;
            })
            .filter((item) => item !== null); // Remove any nulls (products not found)

        setCartWithDetails(detailedCart);

        if (
            !detailedCart.some((product) =>
                categoryList.includes(product.category)
            )
        ) {
            setSelectedOnTop(undefined);
        }
    }, [cart, product]);

    const subTotal = cartWithDetails.reduce(
        (sum, item) => sum + item.totalPrice,
        0
    );

    const onCheckout = () => {
        setCart([]);
        setSelectedCoupon(undefined);
        setSelectedOnTop(undefined);
    };

    return (
        <>
            {/* NavBar */}
            <div className='border-b border-foreground py-3 px-4 lg:px-[10%] flex items-center justify-between fixed top-0 w-full h-16 z-40 shadow'>
                <div className='absolute h-[63px] backdrop-blur -z-10 left-0'></div>
                <h1 className='text-lg font-serif text-primary tracking-[-3.5px]'>
                    DM
                </h1>
                {/* Shopping Cart */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant='ghost' className='relative'>
                            <ShoppingCart />
                            <small className='bg-primary w-4 h-4 text-white rounded-full absolute top-0 right-0'>
                                {cart.length}
                            </small>
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Shopping Cart</SheetTitle>
                            <SheetDescription className='flex flex-col justify-between py-4 '>
                                {cart.length != 0 || 'Your cart is empty'}
                                <div className='grid gap-4'>
                                    {cart.map((item) => (
                                        <div
                                            className='bg-white h-28 rounded-lg overflow-hidden shadow-sm flex'
                                            key={item.id}
                                        >
                                            <img
                                                src={
                                                    product.find(
                                                        (p) => p.id == item.id
                                                    )?.image
                                                }
                                                alt=''
                                                className='w-44 object-cover '
                                            />
                                            <div className='flex flex-col justify-between w-full p-2'>
                                                <div>
                                                    <div className='text-lg text-black'>
                                                        {
                                                            product.find(
                                                                (p) =>
                                                                    p.id ==
                                                                    item.id
                                                            )?.name
                                                        }
                                                    </div>
                                                    <div>
                                                        {
                                                            product.find(
                                                                (p) =>
                                                                    p.id ==
                                                                    item.id
                                                            )?.price
                                                        }
                                                        {
                                                            product.find(
                                                                (p) =>
                                                                    p.id ==
                                                                    item.id
                                                            )?.currency
                                                        }
                                                    </div>
                                                </div>
                                                <div className='self-end'>
                                                    <div className='bg-white rounded-lg p-0.5 flex items-center shadow'>
                                                        <Button
                                                            size={'sm'}
                                                            onClick={() =>
                                                                decreaseCart(
                                                                    item
                                                                )
                                                            }
                                                        >
                                                            <Minus />
                                                        </Button>
                                                        <span className='px-4'>
                                                            {item.amount}
                                                        </span>
                                                        <Button
                                                            size={'sm'}
                                                            onClick={() =>
                                                                increaseCart(
                                                                    item
                                                                )
                                                            }
                                                        >
                                                            <Plus />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className='grid'>
                                    <div className='flex justify-between'>
                                        <div>Subtotal</div>
                                        <span>฿{subTotal.toFixed(2)}</span>
                                    </div>
                                    {cart.length ? (
                                        <div className='flex justify-between'>
                                            <div>Coupon </div>
                                            {selectedCoupon == undefined ? (
                                                <small
                                                    className='flex items-center cursor-pointer hover:opacity-75 duration-200'
                                                    onClick={() =>
                                                        setOpenOffer(true)
                                                    }
                                                >
                                                    Use coupon{' '}
                                                    <ChevronRight className='w-4 h-4' />
                                                </small>
                                            ) : (
                                                <small
                                                    className='text-red-600 flex items-center cursor-pointer hover:opacity-75 duration-200'
                                                    onClick={() =>
                                                        setOpenOffer(true)
                                                    }
                                                >
                                                    -฿{couponDiscount()}
                                                    <ChevronRight className='w-4 h-4' />
                                                </small>
                                            )}
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                    {selectedCoupon ? (
                                        <div className='flex justify-between'>
                                            On Top
                                            {selectedOnTop == undefined ? (
                                                <small
                                                    className='flex items-center cursor-pointer hover:opacity-75 duration-200'
                                                    onClick={() =>
                                                        setOpenOffer(true)
                                                    }
                                                >
                                                    Use On top{' '}
                                                    <ChevronRight className='w-4 h-4' />
                                                </small>
                                            ) : (
                                                <small
                                                    className='text-red-600 flex items-center cursor-pointer hover:opacity-75 duration-200'
                                                    onClick={() =>
                                                        setOpenOffer(true)
                                                    }
                                                >
                                                    -฿{onTopDiscount()}
                                                    <ChevronRight className='w-4 h-4' />
                                                </small>
                                            )}
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                    {selectedOnTop ? (
                                        <div className='flex justify-between'>
                                            <div>Seasonal</div>
                                            <small className='text-red-600'>
                                                -฿{seasonalDiscount()}
                                            </small>
                                        </div>
                                    ) : null}
                                    <div className='flex justify-between text-lg text-black font-medium'>
                                        <div>Total</div>
                                        <span>
                                            ฿
                                            {(
                                                subTotal -
                                                couponDiscount() -
                                                onTopDiscount() -
                                                seasonalDiscount()
                                            ).toFixed(2)}
                                        </span>
                                    </div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                disabled={cart.length <= 0}
                                                className='mt-4'
                                                size={'lg'}
                                                onClick={onCheckout}
                                            >
                                                Checkout
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Are you absolutely sure?
                                                </DialogTitle>
                                                <DialogDescription>
                                                    This action cannot be
                                                    undone. This will
                                                    permanently delete your
                                                    account and remove your data
                                                    from our servers.
                                                </DialogDescription>
                                            </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
                {/* Coupon and onTop */}
                <Sheet open={openOffer} onOpenChange={setOpenOffer}>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Add Coupon and On Top</SheetTitle>
                            <SheetDescription className='flex flex-col p-2 gap-2'>
                                <p className='text-foreground font-medium'>
                                    Coupon
                                </p>
                                {coupon.map((c) => (
                                    <div
                                        key={c.id}
                                        className={`bg-white hover:opacity-80 duration-200 cursor-pointer shadow rounded-lg flex items-center border ${
                                            c.id == selectedCoupon?.id
                                                ? 'border-foreground'
                                                : 'border-transparent'
                                        }`}
                                        onClick={() => onSelectCoupon(c)}
                                    >
                                        <div className='p-4'>
                                            <Ticket />
                                        </div>
                                        <div className='leading-4'>
                                            <div className='font-bold text-black'>
                                                {c.discount}
                                                {c.type == 'amount'
                                                    ? 'THB'
                                                    : '%'}
                                            </div>
                                            <small>Min. Spend 0 THB</small>
                                        </div>
                                    </div>
                                ))}
                                <p className='text-foreground font-medium'>
                                    On Top
                                </p>

                                {onTop.map((t) => (
                                    <div
                                        key={t.id}
                                        className={`bg-white hover:opacity-80 duration-200 cursor-pointer shadow rounded-lg flex items-center border ${
                                            t.id == selectedOnTop?.id
                                                ? 'border-foreground'
                                                : 'border-transparent'
                                        }
                                        ${
                                            t.disabled?.(cartWithDetails) ||
                                            !selectedCoupon
                                                ? 'pointer-events-none opacity-50'
                                                : ''
                                        }`}
                                        onClick={() => onSelectOnTop(t)}
                                    >
                                        <div className='p-4'>
                                            <Ticket />
                                        </div>
                                        <div className='leading-4'>
                                            {t.type == 'point' ? (
                                                <>
                                                    <div className='font-bold text-black'>
                                                        Use{' '}
                                                        {subTotal * 0.2 >
                                                        userPoint
                                                            ? userPoint
                                                            : (
                                                                  subTotal * 0.2
                                                              ).toFixed(0)}{' '}
                                                        Point
                                                    </div>
                                                    <small>
                                                        Use your point to get
                                                        discount (1 point =
                                                        1THB)
                                                    </small>
                                                </>
                                            ) : (
                                                <>
                                                    <div className='font-bold text-black'>
                                                        {t.amount}%
                                                    </div>
                                                    <small>
                                                        Only{' '}
                                                        {categoryList.join(
                                                            ', '
                                                        )}
                                                        .
                                                    </small>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>
            <div className=' mx-auto max-w-[1400px] xl:border-x border-foreground'>
                <div className='col-span-3 h-16 backdrop-blur sticky top-0 z-10'></div>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0.5'>
                    {product.map((item, i) => (
                        <div key={i} className='relative group bg-[#F2F2F2]'>
                            <img
                                src={item.image}
                                alt=''
                                className='w-full h-[30rem] object-cover'
                            />
                            <div className='absolute top-0 w-full flex justify-between items-start px-2 pt-3 opacity-100 lg:opacity-0 group-hover:opacity-100 duration-300 '>
                                {item.name}
                                <span className=' text-3xl'>
                                    {item.price} {item.currency}
                                </span>
                            </div>
                            <div className='absolute z-10 bottom-0 w-full flex justify-end items-center p-4 opacity-100 lg:opacity-0 group-hover:opacity-100 duration-300 '>
                                {cart.findIndex((p) => p.id == item.id) >= 0 ? (
                                    <div className='bg-white rounded-lg p-0.5 flex items-center shadow'>
                                        <Button
                                            onClick={() => decreaseCart(item)}
                                        >
                                            <Minus />
                                        </Button>
                                        <span className='px-4'>
                                            {
                                                cart.find(
                                                    (p) => p.id == item.id
                                                )?.amount
                                            }
                                        </span>
                                        <Button
                                            onClick={() => increaseCart(item)}
                                        >
                                            <Plus />
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        className='shadow'
                                        onClick={() => increaseCart(item)}
                                    >
                                        <Plus />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default App;
