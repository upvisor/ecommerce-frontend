import React from "react"
import { Design, ICategory, IStoreData } from "@/interfaces"
import Footer from "../ui/Footer"
import { Navbar } from "."
import { Chat } from "../chat"

async function fetchDesign () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/design`)
  return res.json()
}

async function fetchStoreData () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store-data`)
  return res.json()
}

async function fetchCategories () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
  return res.json()
}

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  
  const design: Design = await fetchDesign()
  
  const storeData: IStoreData = await fetchStoreData()

  const categories: ICategory[] = await fetchCategories()
  
  return (
      <Navbar design={design} storeData={storeData} categories={categories}>
        <div className="h-[50px] sm:h-[53px]" />
        { children }
        <Footer />
        <Chat />
      </Navbar>
  )
}